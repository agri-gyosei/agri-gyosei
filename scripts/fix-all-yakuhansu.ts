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

// 「約半数」→各記事の文脈に合った表現に一括置換
const REPLACEMENTS: Record<string, [string, string]> = {
  // ダーチャとは何か？記事（ユーザー指定の正確な修正）
  'what-is-dacha-why-russia-survived-hunger': [
    'ロシア国民の約半数がこのダーチャを持ち、週末になると家族そろって畑を耕し、',
    '国民の3人に1人がこのダーチャを持つとされ（2012年・ロシア政府情報紙）、週末になると家族そろって畑を耕し、',
  ],
  // 農地転用記事
  'nouchi-tenyo-kyoka-flow-cost-gyoseishoshi': [
    'ロシア国民の約半数が持つ週末の拠点',
    '国民の3人に1人が持つ週末の拠点（2012年・ロシア政府情報紙）',
  ],
  // 農業委員会記事
  'agricultural-committee-application-complete-guide': [
    'ロシア国民の約半数がダーチャを持ち、週末に家族で農作業をしながら土と向き合う',
    '国民の3人に1人がダーチャを持つとされ（2012年・ロシア政府情報紙）、週末に家族で農作業をしながら土と向き合う',
  ],
  // サラリーマン農家記事
  'salaryman-becoming-part-time-farmer': [
    'ロシア国民の約半数が持つダーチャで野菜を育て、',
    '国民の3人に1人が持つとされるダーチャ（2012年・ロシア政府情報紙）で野菜を育て、',
  ],
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  for (const [slug, [before, after]] of Object.entries(REPLACEMENTS)) {
    const { data, error } = await supabase
      .from('dacha_articles')
      .select('body_mdx')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      console.log(`⚠️  ${slug}: 取得失敗 (${error?.message})`)
      continue
    }

    if (!data.body_mdx.includes(before)) {
      console.log(`⚠️  ${slug}: 該当テキストなし（既修正の可能性）`)
      continue
    }

    const newBody = data.body_mdx.replace(before, after)
    const { error: updateError } = await supabase
      .from('dacha_articles')
      .update({ body_mdx: newBody })
      .eq('slug', slug)

    if (updateError) {
      console.log(`❌  ${slug}: 更新失敗 (${updateError.message})`)
    } else {
      console.log(`✅  ${slug}`)
      console.log(`    前: ${before.substring(0, 50)}...`)
      console.log(`    後: ${after.substring(0, 50)}...`)
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })
