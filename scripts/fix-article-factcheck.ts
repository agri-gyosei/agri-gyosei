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

  const { data: article } = await supabase
    .from('dacha_articles')
    .select('id, body_mdx')
    .eq('slug', 'farmland-law-beginner-guide-for-salaried-workers')
    .single()

  if (!article) throw new Error('Article not found')

  let fixed = article.body_mdx

  // ① 下限面積要件の廃止（2023年農地法改正）
  fixed = fixed.replace(
    /- \*\*下限面積要件\*\*：原則として一定の面積以上の農地を取得すること（市町村によって異なるが、多くの地域で50a＝5反＝約5,000㎡が目安。ただし、別段面積として市町村が独自に下限を引き下げている地域も多い）/,
    '- **下限面積要件**：2023年（令和5年）の農地法改正により、**下限面積要件は廃止**されました。以前は多くの地域で50a（5反・約5,000㎡）が目安とされていましたが、現在はこの要件がなくなり、小規模な農地でも取得申請しやすくなっています。'
  )

  // ② 「常時従事」の誤解を招く表現を修正
  fixed = fixed.replace(
    /- \*\*農業に常時従事できること\*\*（全部効率利用要件）：取得した農地を適切に耕作すること/,
    '- **農作業に必要な時間を確保できること**（全部効率利用要件）：取得した農地を適切に耕作・管理できること。「常時従事」＝専業農家である必要はなく、会社員として働きながら週末に農作業を行う兼業スタイルでも十分に認められます。'
  )

  if (fixed === article.body_mdx) {
    console.log('パターン不一致。確認のため検索：')
    console.log('下限面積含む？', article.body_mdx.includes('下限面積'))
    console.log('常時従事含む？', article.body_mdx.includes('常時従事'))
    return
  }

  const changedParts: string[] = []
  if (!article.body_mdx.includes('下限面積要件は廃止')) changedParts.push('①下限面積要件')
  if (!article.body_mdx.includes('農作業に必要な時間を確保')) changedParts.push('②常時従事の表現')
  console.log('修正対象：', changedParts.join('、'))

  const { error } = await supabase
    .from('dacha_articles')
    .update({ body_mdx: fixed })
    .eq('id', article.id)

  if (error) throw error
  console.log('修正完了')
}

main().catch(e => { console.error(e); process.exit(1) })
