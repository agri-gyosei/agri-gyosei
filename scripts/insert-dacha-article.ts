import { createClient } from '@supabase/supabase-js'
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

  const mdPath = path.join(process.cwd(), 'dacha-soviet-strategy.md')
  const raw = fs.readFileSync(mdPath, 'utf-8')

  // H1タイトルを除いた本文（ページ側でtitleを表示するため）
  const body_mdx = raw.replace(/^# .+\n\n/, '').trim()

  // 明日のJST 5:00 = UTC 前日20:00
  const tomorrow = new Date()
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  tomorrow.setUTCHours(20, 0, 0, 0) // UTC 20:00 = JST 05:00

  const { error } = await supabase.from('dacha_articles').insert({
    slug: 'dacha-soviet-strategy',
    title: 'ダーチャはソビエトの国家戦略だった——日本人が今こそ個人で持つべき視点',
    body_mdx,
    category: '食料安全保障',
    seo_description: 'ソビエトがなぜ国民に農地を与えたのか。食料自給率37%の日本で、個人が農地を持つことの意味を歴史的視点から解説します。',
    is_member_only: false,
    published_at: tomorrow.toISOString(),
  })

  if (error) {
    if (error.code === '23505') {
      console.log('既に存在します（slug重複）')
      return
    }
    throw error
  }

  console.log(`挿入完了: published_at = ${tomorrow.toISOString()} (JST: 明日5:00)`)
}

main().catch(e => { console.error(e); process.exit(1) })
