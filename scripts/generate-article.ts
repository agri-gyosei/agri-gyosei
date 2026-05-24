import { createClient } from '@supabase/supabase-js'
import { generateArticle } from '../lib/agents/content-agent'
import * as fs from 'fs'
import * as path from 'path'

// .env.local を読み込む（ローカル実行用）
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^=]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const now = new Date()
  // JST (UTC+9) に変換して日付を取得
  const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const month = jstDate.getUTCMonth() + 1
  const day = jstDate.getUTCDate()
  console.log(`Generating article for ${month}月${day}日...`)
  const article = await generateArticle(now)

  console.log(`Generated: "${article.title}" [${article.category}]`)

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
      console.log(`Slug "${article.slug}" already exists, skipping.`)
    } else {
      throw error
    }
  } else {
    console.log(`Saved article: ${article.slug}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
