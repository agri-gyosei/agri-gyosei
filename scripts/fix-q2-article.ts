import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

import { createClient } from '@supabase/supabase-js'

const SLUG = 'gyosei-jiken-sosho-shobunsei-genkoku-tekikaku'
const BEFORE = '平成4年改正'
const AFTER = '平成26年改正'

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 現在の記事を取得
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, body_mdx')
    .eq('slug', SLUG)
    .single()

  if (error || !data) throw new Error(`記事取得失敗: ${error?.message}`)
  console.log('取得:', data.title)

  // 変更前のテキストが含まれているか確認
  const count = (data.body_mdx.match(new RegExp(BEFORE, 'g')) || []).length
  console.log(`「${BEFORE}」の出現回数:`, count)
  if (count === 0) throw new Error(`「${BEFORE}」が見つかりません`)

  const newBody = data.body_mdx.replace(new RegExp(BEFORE, 'g'), AFTER)

  // 更新
  const { error: updateError } = await supabase
    .from('articles')
    .update({ body_mdx: newBody })
    .eq('slug', SLUG)

  if (updateError) throw new Error(`更新失敗: ${updateError.message}`)
  console.log(`✅ 修正完了: 「${BEFORE}」→「${AFTER}」(${count}箇所)`)
}

main().catch(console.error)
