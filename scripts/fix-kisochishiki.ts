import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

import { createClient } from '@supabase/supabase-js'

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // タイトルで記事を検索
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, body_mdx')
    .ilike('title', '%戦略的合格%')
    .single()

  if (error || !data) throw new Error(`記事取得失敗: ${error?.message}`)
  console.log('取得:', data.title)
  console.log('slug:', data.slug)

  let body = data.body_mdx

  // ① 特定の見出し変更（「基礎知識」のみ、旧表記なし）
  body = body.replace(
    /📌 一般知識：最低限の「足切り対策」だけ/g,
    '📌 基礎知識：最低限の「足切り対策」だけ'
  )

  // ② 足切りラインの文変更
  body = body.replace(
    /一般知識には足切りライン（14問中6問以上正解）があります/g,
    '基礎知識には足切りライン（14問中6問以上正解）があります'
  )

  // ③ Q1解説の足切り条件を修正
  body = body.replace(
    /②一般知識が満点の40%（6問）以上、/g,
    '②基礎知識が満点の40%以上（14問中6問・24点以上）、'
  )

  // ④ 「文章理解（3問）は〜」の段落の前に注記を追加
  body = body.replace(
    /(文章理解（3問）は)/,
    'なお、令和6年度（2024年度）から科目名が『一般知識等』→『基礎知識』に変更され、行政書士法等の諸法令が新たに追加されています。\n\n$1'
  )

  // ⑤ 残りの単独「一般知識」を「基礎知識（旧：一般知識）」に置換
  // ただし「一般知識（…）」のように直後に（がある場合は置換しない
  body = body.replace(/一般知識(?!（[^）]*）)/g, '基礎知識（旧：一般知識）')

  // 変更確認
  const countKiso = (body.match(/基礎知識/g) || []).length
  const countIppan = (body.match(/一般知識/g) || []).length
  console.log(`「基礎知識」出現数: ${countKiso}`)
  console.log(`「一般知識」残り: ${countIppan}（（）付きコンテキストのみのはず）`)

  // 更新
  const { error: updateError } = await supabase
    .from('articles')
    .update({ body_mdx: body })
    .eq('slug', data.slug)

  if (updateError) throw new Error(`更新失敗: ${updateError.message}`)
  console.log('✅ 修正完了')
}

main().catch(console.error)
