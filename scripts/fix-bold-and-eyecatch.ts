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

// **text** → <strong>text</strong>（MDXパーサーが特殊文字前後で認識しないケースを回避）
function boldToStrong(md: string): string {
  // インラインコードブロック内は変換しない
  // 非貪欲マッチで **...** を <strong>...</strong> に変換
  return md.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const slug = 'gyosei-sosho-gimudzuke-sashidome'

  const { data: article } = await supabase
    .from('articles')
    .select('id, body_mdx')
    .eq('slug', slug)
    .single()

  if (!article) throw new Error('Article not found')

  // ** → <strong> 変換
  let fixed = boldToStrong(article.body_mdx)

  // アイキャッチ画像をまだ挿入していなければ先頭に追加
  const eyecatch = `![アイキャッチ](/sikaku/images/${slug}.jpg)\n\n`
  if (!fixed.startsWith('![')) {
    fixed = eyecatch + fixed
  }

  const { error } = await supabase
    .from('articles')
    .update({ body_mdx: fixed })
    .eq('id', article.id)

  if (error) throw error
  console.log('完了：**→<strong>変換 ＋ アイキャッチ挿入')
}

main().catch(e => { console.error(e); process.exit(1) })
