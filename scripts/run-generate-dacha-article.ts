import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { generateDachaArticle, factCheckDachaArticle } from '../lib/agents/dacha-agent'
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

  const jstDateParam = process.argv[2]
  let jstDate: Date
  if (jstDateParam) {
    const [m, d] = jstDateParam.split('/').map(Number)
    const y = new Date().getUTCFullYear()
    jstDate = new Date(Date.UTC(y, m - 1, d, 0, 0, 0))
  } else {
    jstDate = new Date(Date.now() + 9 * 60 * 60 * 1000)
  }

  // 当日JST内に既に記事が存在する場合はスキップ（重複生成防止）
  const yyyy = jstDate.getUTCFullYear()
  const mm = jstDate.getUTCMonth()
  const dd = jstDate.getUTCDate()
  const jstDayStartUTC = new Date(Date.UTC(yyyy, mm, dd, 0, 0, 0) - 9 * 60 * 60 * 1000)
  const jstDayEndUTC = new Date(jstDayStartUTC.getTime() + 24 * 60 * 60 * 1000)
  const { data: existing } = await supabase
    .from('dacha_articles')
    .select('id, title')
    .gte('published_at', jstDayStartUTC.toISOString())
    .lt('published_at', jstDayEndUTC.toISOString())
    .limit(1)
  if (existing && existing.length > 0) {
    console.log(`スキップ: 本日のダーチャ記事は既に存在します（${existing[0].title}）`)
    return
  }

  console.log(`ダーチャ記事生成開始: ${jstDate.toISOString()}`)
  const client = new Anthropic()
  const article = await generateDachaArticle(jstDate)

  const { body_mdx: checkedBody, changes } = await factCheckDachaArticle(article, client)
  if (changes.length > 0) article.body_mdx = checkedBody

  const { error } = await supabase.from('dacha_articles').insert({
    slug: article.slug,
    title: article.title,
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

  console.log(`完了: ${article.title}`)
}

main().catch(e => { console.error(e); process.exit(1) })
