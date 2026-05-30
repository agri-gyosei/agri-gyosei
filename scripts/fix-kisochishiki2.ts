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

  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, body_mdx')
    .eq('slug', 'strategic-study-method-for-passing-score')
    .single()

  if (error || !data) throw new Error(`取得失敗: ${error?.message}`)

  // 注記の中の誤置換を修正：『基礎知識（旧：一般知識）等』→ 『一般知識等』
  const before = `『基礎知識（旧：一般知識）等』→『基礎知識』`
  const after = `『一般知識等』→『基礎知識』`

  if (!data.body_mdx.includes(before)) {
    console.log('対象テキストが見つかりません。既に修正済みか確認してください。')
    return
  }

  const newBody = data.body_mdx.replace(before, after)

  const { error: updateError } = await supabase
    .from('articles')
    .update({ body_mdx: newBody })
    .eq('slug', data.slug)

  if (updateError) throw new Error(`更新失敗: ${updateError.message}`)
  console.log('✅ 注記内の誤置換を修正しました')
  console.log(`「${before}」→「${after}」`)
}

main().catch(console.error)
