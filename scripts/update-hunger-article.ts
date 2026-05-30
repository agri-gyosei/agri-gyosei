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

const SLUG = 'what-is-dacha-why-russia-survived-hunger'

const TITLE = '週末、家族で畑へ行く。それだけで人生が変わった話'

const SEO_DESCRIPTION =
  'サラリーマンが週末農業を始めたら、家族の時間・食卓・会話が変わった。ダーチャ的な暮らしを日本で実践するとどうなるのか、リアルな生活像と農地取得の入口を具体的に紹介します。'

const BODY_MDX = `週末の朝、子どもが畑に駆け込む。完熟したトマトをもいで、そのまま口に入れる。「あまい！」という声が畑に響く——これが、小さな農地を持つ家族の、ふつうの土曜日だ。

家族で畑へ行く。ただそれだけで、暮らしは静かに変わり始める。土の匂いを嗅いで、ああこれだと思う。忙しい毎日の中で、何かが少しずつ戻ってくる感覚。週末農業を始めた人の多くが、そう話す。

## 週末農業で変わった3つのこと

### 食卓の会話が変わる

「今日のキュウリ、採れすぎた」「次はスイカを植えてみよう」「カブが虫にやられてた、どうすればいい？」——畑を持つ前、休日の食卓には沈黙かスマホの画面が多かった。今は違う。土の話、虫の話、今週の雨の話——話題が増えた。

食材に名前がつくと、会話が生まれる。スーパーで買ったキュウリには「いつ、誰が」がない。でも畑のキュウリには物語がある。「あの日、二人で種をまいた」「水が足りなかったのかな」。食べる前から、もう会話になっている。

### 子どもの「食べる」が変わる

自分で育てた野菜は食べる——これは多くの農家が口をそろえる話だ。好き嫌いが激しかった子どもが、自分で水をやった枝豆はいくらでも食べる。トマトが嫌いだった子どもが、自分でもいだトマトだけは食べる。

体験に勝る食育はない。「どこから来るのか」を知っている子どもと知らない子どもでは、食への向き合い方が違ってくる。畑は、子どもにとって最高の教室になる。それも、楽しい教室だ。

### 週末の使い方が変わる

「どこ行く？」「特にない」「じゃあ家で」——そんな会話がなくなる。行き先が決まっているからだ。家族に目的地ができると、不思議と全員が動き出す。

農作業は体を使う。土を触り、汗をかき、収穫する。疲れるのに気持ちがいい。週明けの月曜日、体は疲れているのに心が軽い。これが週末農業のリズムだ。ジムや公園とは違う、「実りある疲労感」がある。

## ダーチャという生き方が教えてくれたこと

ロシアに「ダーチャ」という文化がある。郊外に小さな土地と小屋を持ち、週末に家族で農作業をする暮らし方だ。2012年のロシア政府資料によれば、4千万を超えるダーチャ・菜園が存在し、国民の3人に1人が所有者だという。

ダーチャはもともと国家が分配した土地だったが、今やロシア人の「喜び」として文化に根付いている。週末に土を耕し、家族と過ごし、旬の作物を収穫する。それ自体が豊かさの証になっている。

作家ウラジーミル・メグレの著作『アナスタシア』シリーズは、自然と共生し、自分の土地で食を育てることへの根源的な喜びを描いた。日本でも静かに読まれ続けている。「ただ土を耕し、種をまく。それだけで人は変わる」——そんな言葉が心に刺さる人は少なくない。

「食を育てることは、暮らしを育てること」——そう気づいたとき、週末農業は趣味を超える。

## サラリーマンでも農地は持てる（具体的に）

「農地は農家しか買えない」——そう思っている人は多い。でも現実は変わっている。

<strong>2023年農地法改正で、下限面積要件が廃止された。</strong>以前は都道府県によって「50アール以上」などの広い面積が最低条件だったが、この要件が撤廃された。小さな面積でも農地を取得できる道が広がっている。

農地法3条に基づく農業委員会への申請・許可を経れば、サラリーマンのまま兼業農家として農地を取得できる。農作業への継続的な従事が求められるため、事前に農業委員会に確認しておこう。申請書類の作成に不安があれば、行政書士に相談するのが確実だ。

農地の価格は、住宅地より圧倒的に安い。地方では数万円〜数十万円で取得できる事例もある。週末の移動費や体験農園の年会費と比べると、自分の農地を持つ選択肢が現実的に見えてくるかもしれない。

まず今日、<a href="https://map.maff.go.jp/" target="_blank" rel="noopener noreferrer">eMAFF農地ナビ</a>を開いてみよう。農林水産省が提供する地図サービスで、全国の農地情報を無料で確認できる。自分の地元や気になるエリアにどんな農地があるか、眺めるだけで発見がある。

## まず、小さな一歩から

畑を持つことは、家族の時間を変えるかもしれない。でも大きな決断をする前に、小さな一歩でいい。

まず農地ナビを開いてみよう。次に、近くの体験農園や市民農園で土を触ってみよう。そして家族に話してみよう。「小さな畑、持ってみない？」——その一言から、何かが始まる。

---

**今日からできること（3ステップ）**

1. <a href="https://map.maff.go.jp/" target="_blank" rel="noopener noreferrer">eMAFF農地ナビ</a>で地元の農地を眺める
2. 市民農園や体験農園で土に触れてみる
3. 家族に「小さな畑、持ってみない？」と話す`

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 既存レコードを確認
  const { data: existing, error: fetchError } = await supabase
    .from('dacha_articles')
    .select('slug, title, published_at')
    .eq('slug', SLUG)
    .single()

  if (fetchError) {
    console.error('記事が見つかりません:', fetchError)
    process.exit(1)
  }

  console.log('既存記事:', existing.title)
  console.log('published_at:', existing.published_at)

  const { error: updateError } = await supabase
    .from('dacha_articles')
    .update({
      title: TITLE,
      body_mdx: BODY_MDX,
      category: 'ダーチャという生き方',
      seo_description: SEO_DESCRIPTION,
    })
    .eq('slug', SLUG)

  if (updateError) {
    console.error('更新失敗:', updateError)
    process.exit(1)
  }

  console.log(`✓ 更新完了: ${SLUG}`)
  console.log(`  タイトル: ${TITLE}`)
  console.log(`  本文文字数: ${BODY_MDX.length}`)
}

main().catch(e => { console.error(e); process.exit(1) })
