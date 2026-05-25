import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { generateArticle, factCheckArticle } from '../lib/agents/content-agent'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^=]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { count, error: countError } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
  if (countError) throw countError
  const articleIndex = count ?? 0

  const jstDateParam = process.argv[2]
  const now = new Date()
  let month: number, day: number
  if (jstDateParam) {
    const [m, d] = jstDateParam.split('/').map(Number)
    month = m
    day = d
  } else {
    const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    month = jstDate.getUTCMonth() + 1
    day = jstDate.getUTCDate()
  }

  console.log(`記事生成開始: ${month}/${day} index=${articleIndex}`)
  const client = new Anthropic()
  const article = await generateArticle(now, articleIndex)

  const { body_mdx: checkedBody, changes } = await factCheckArticle(article, client)
  if (changes.length > 0) article.body_mdx = checkedBody

  const displayTitle = `${month}/${day}｜${article.title}`

  const { error } = await supabase.from('articles').insert({
    slug: article.slug,
    title: displayTitle,
    body_mdx: article.body_mdx,
    category: article.category,
    seo_description: article.seo_description,
    is_member_only: false,
  })

  if (error) {
    if (error.code === '23505') {
      console.log(`スキップ: slug "${article.slug}" は既に存在します`)
      return
    }
    throw error
  }

  console.log(`完了: ${displayTitle}`)
}

main().catch(e => { console.error(e); process.exit(1) })
