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

  // ── 修正1: サラリーマンのまま農家になる方法（今日生成記事）──
  {
    const { data, error } = await supabase
      .from('dacha_articles')
      .select('id, slug, title, body_mdx, seo_description')
      .ilike('title', '%サラリーマンのまま農家%')
      .order('published_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      console.error('対象記事が見つかりません:', error)
    } else {
      console.log(`\n[記事1] ${data.title} (slug: ${data.slug})`)

      let body = data.body_mdx

      // 修正①: 耕作放棄地の出典・年度
      const before1 = body
      body = body
        .replace(
          /2020年の農林業センサス（農林水産省）によれば[、,]?\s*耕作放棄地面積は約42万ヘクタールと報告されており[、,]?/g,
          '農林水産省の調査によれば、耕作放棄地面積は2015年時点で約42万ヘクタールに達しており、'
        )
        // パターンが少し違う場合も対応
        .replace(
          /2020年の農林業センサス（農林水産省）によれば、耕作放棄地面積は約42万ヘクタール/g,
          '農林水産省の調査によれば、耕作放棄地面積は2015年時点で約42万ヘクタール'
        )
      console.log(`  修正①（耕作放棄地）: ${before1 !== body ? '✅ 修正あり' : '⚠️ 該当テキストなし（確認要）'}`)

      // 修正②: 食料自給率の年度を2023→2024に更新（%は38のまま）
      const before2 = body
      body = body
        .replace(
          /農林水産省が2024年8月に公表した2023年度（令和5年度）の\s*食料自給率は、カロリーベースでわずか38%/g,
          '農林水産省が公表した2024年度（令和6年度）の食料自給率は、カロリーベースでわずか38%'
        )
        .replace(
          /農林水産省が2024年8月に公表した2023年度（令和5年度）の食料自給率は、カロリーベースでわずか38%/g,
          '農林水産省が公表した2024年度（令和6年度）の食料自給率は、カロリーベースでわずか38%'
        )
        // 年度だけ変わっている場合
        .replace(/2023年度（令和5年度）の食料自給率は、カロリーベースでわずか38%/g,
          '2024年度（令和6年度）の食料自給率は、カロリーベースでわずか38%')
      console.log(`  修正②（食料自給率年度）: ${before2 !== body ? '✅ 修正あり' : '⚠️ 該当テキストなし（確認要）'}`)

      const { error: updateError } = await supabase
        .from('dacha_articles')
        .update({ body_mdx: body })
        .eq('slug', data.slug)

      if (updateError) console.error('  更新エラー:', updateError)
      else console.log('  ✅ DB更新完了')
    }
  }

  // ── 修正2: ダーチャとは何か記事の37%→38%差し戻し ──
  {
    const slug = 'what-is-dacha-why-russia-survived-famine'
    const { data, error } = await supabase
      .from('dacha_articles')
      .select('id, slug, title, body_mdx, seo_description')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      console.error('\n[記事2] ダーチャとは何か記事が見つかりません:', error)
    } else {
      console.log(`\n[記事2] ${data.title} (slug: ${data.slug})`)
      const count37 = (data.body_mdx.match(/37%/g) ?? []).length
      console.log(`  body_mdx 内の "37%" 件数: ${count37}`)

      if (count37 === 0) {
        console.log('  変更不要（既に38%）')
      } else {
        const newBody = data.body_mdx
          .replace(/37%（2024年度、農林水産省確定値）/g, '38%（2024年度、農林水産省発表値）')
          .replace(/37%（2024年度・カロリーベース、農林水産省確定値）/g, '38%（2024年度・カロリーベース、農林水産省発表値）')
          .replace(/2024年度で37%/g, '2024年度で38%')
          .replace(/37%/g, '38%')

        const newSeo = (data.seo_description ?? '').replace(/37%/g, '38%')

        const { error: updateError } = await supabase
          .from('dacha_articles')
          .update({ body_mdx: newBody, seo_description: newSeo })
          .eq('slug', slug)

        if (updateError) console.error('  更新エラー:', updateError)
        else console.log(`  ✅ DB更新完了（37%→38% を ${count37} 件差し戻し）`)
      }
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })
