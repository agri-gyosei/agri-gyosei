import Anthropic from '@anthropic-ai/sdk'
import contentSystemPrompt from './prompts/content-system'
import sikakuFactcheckPrompt from './prompts/sikaku-factcheck'

type TopicEntry = {
  category: string
  topic: string
}

// 行政書士試験 半年合格カリキュラム（順番通りに学習）
const CURRICULUM: TopicEntry[] = [
  // ── Phase 1: 行政書士試験の入口・全体像 ──
  { category: '行政法・憲法', topic: '行政書士試験の全体像と半年合格戦略（出題数・配点・合格点）' },

  // ── Phase 2: 行政手続法 ──
  { category: '行政法・憲法', topic: '行政手続法①：申請と処分の基本（申請に対する処分・標準処理期間）' },
  { category: '行政法・憲法', topic: '行政手続法②：不利益処分と聴聞・弁明の機会の付与' },
  { category: '行政法・憲法', topic: '行政手続法③：行政指導・届出・命令等制定手続（パブコメ）' },

  // ── Phase 3: 行政不服申立て ──
  { category: '行政法・憲法', topic: '行政不服申立て①：審査請求の基本と手続きの流れ' },
  { category: '行政法・憲法', topic: '行政不服申立て②：裁決・決定の種類と効力（認容・棄却・却下）' },
  { category: '行政法・憲法', topic: '行政不服申立て③：再調査の請求・再審査請求・審査請求前置主義' },

  // ── Phase 4: 行政事件訴訟法 ──
  { category: '行政法・憲法', topic: '行政事件訴訟法①：取消訴訟の訴訟要件（処分性・原告適格）' },
  { category: '行政法・憲法', topic: '行政事件訴訟法②：取消訴訟の訴訟要件（被告・管轄・出訴期間）' },
  { category: '行政法・憲法', topic: '行政事件訴訟法③：取消訴訟の審理と本案勝訴要件・判決の効力' },
  { category: '行政法・憲法', topic: '行政事件訴訟法④：義務付け訴訟（申請型・非申請型）の訴訟要件' },
  { category: '行政法・憲法', topic: '行政事件訴訟法⑤：差止訴訟の訴訟要件と本案勝訴要件' },
  { category: '行政法・憲法', topic: '行政事件訴訟法⑥：仮の救済（執行停止・仮の義務付け・仮の差止め）' },
  { category: '行政法・憲法', topic: '行政事件訴訟法⑦：当事者訴訟・機関訴訟・民衆訴訟（客観的訴訟）' },

  // ── Phase 5: 国家賠償・損失補償 ──
  { category: '行政法・憲法', topic: '国家賠償法①：1条（公権力の行使による賠償責任）の要件と判例' },
  { category: '行政法・憲法', topic: '国家賠償法②：2条（営造物の瑕疵）と損失補償の基本' },

  // ── Phase 6: 地方自治法 ──
  { category: '行政法・憲法', topic: '地方自治法①：地方公共団体の種類・住民の権利・直接請求' },
  { category: '行政法・憲法', topic: '地方自治法②：議会・長・執行機関の権限と相互関係' },
  { category: '行政法・憲法', topic: '地方自治法③：財政・住民訴訟・条例・規則' },

  // ── Phase 7: 行政法の基本原則・横断整理 ──
  { category: '行政法・憲法', topic: '行政法の基本原則（法律の留保・比例原則・信義則・平等原則）' },
  { category: '行政法・憲法', topic: '行政法の横断整理（審査請求 vs 取消訴訟の比較・試験頻出パターン）' },

  // ── Phase 8: 憲法 ──
  { category: '行政法・憲法', topic: '憲法①：基本的人権の体系・限界と違憲審査基準（二重の基準論）' },
  { category: '行政法・憲法', topic: '憲法②：精神的自由（表現の自由・集会・信教・学問の自由）' },
  { category: '行政法・憲法', topic: '憲法③：精神的自由の重要判例（チャタレー・猿払・博多駅・よど号等）' },
  { category: '行政法・憲法', topic: '憲法④：経済的自由（職業選択・財産権）と二重の基準・規制目的二分論' },
  { category: '行政法・憲法', topic: '憲法⑤：人身の自由・社会権（生存権・教育・労働）・参政権' },
  { category: '行政法・憲法', topic: '憲法⑥：統治機構（国会の地位・衆参の違い・立法手続）' },
  { category: '行政法・憲法', topic: '憲法⑦：統治機構（内閣・議院内閣制・衆議院解散）' },
  { category: '行政法・憲法', topic: '憲法⑧：統治機構（司法・違憲審査制・最高裁の役割）' },

  // ── Phase 9: 民法・総則 ──
  { category: '民法', topic: '民法①：民法の基本原則・意思表示の瑕疵（錯誤・詐欺・強迫）' },
  { category: '民法', topic: '民法②：代理の基本（有権代理・無権代理・表見代理の要件と効果）' },
  { category: '民法', topic: '民法③：時効（取得時効・消滅時効・完成猶予・更新の整理）' },
  { category: '民法', topic: '民法④：条件・期限・期間の計算（試験頻出の基礎知識）' },

  // ── Phase 10: 物権・担保物権 ──
  { category: '民法', topic: '民法⑤：物権変動と対抗要件（177条・178条・二重譲渡の優劣）' },
  { category: '民法', topic: '民法⑥：担保物権①（抵当権の成立・効力・消滅・法定地上権）' },
  { category: '民法', topic: '民法⑦：担保物権②（根抵当権・質権・留置権・先取特権）' },

  // ── Phase 11: 債権総論 ──
  { category: '民法', topic: '民法⑧：債権総論①（債務不履行・損害賠償・解除の要件）' },
  { category: '民法', topic: '民法⑨：債権総論②（連帯債務・保証・連帯保証の違いと効力）' },
  { category: '民法', topic: '民法⑩：債権総論③（相殺・債権譲渡・弁済・相殺・更改）' },

  // ── Phase 12: 債権各論 ──
  { category: '民法', topic: '民法⑪：債権各論①（売買・贈与・請負の基本と契約不適合責任）' },
  { category: '民法', topic: '民法⑫：債権各論②（賃貸借・使用貸借・消費貸借）' },
  { category: '民法', topic: '民法⑬：不法行為（一般的不法行為・特殊不法行為・使用者責任）' },

  // ── Phase 13: 親族・相続 ──
  { category: '民法', topic: '民法⑭：親族法（婚姻・離婚・親子・養子縁組・成年後見）' },
  { category: '民法', topic: '民法⑮：相続法（法定相続・遺言・遺留分・相続放棄・限定承認）' },
  { category: '民法', topic: '民法の難所攻略（リーガルマインドで解くひっかけ問題・判例の読み方）' },

  // ── Phase 14: 商法・会社法 ──
  { category: '商法・会社法', topic: '商法総則・商行為（商人の定義・商号・支配人・代理商）' },
  { category: '商法・会社法', topic: '会社法①：会社の種類と株式会社の設立・株主の権利' },
  { category: '商法・会社法', topic: '会社法②：株式会社の機関（取締役・取締役会・代表取締役）' },
  { category: '商法・会社法', topic: '会社法③：株式会社の機関（監査役・会計参与・指名委員会等設置会社）' },
  { category: '商法・会社法', topic: '会社法④：資金調達（株式・新株予約権・社債）と組織再編（合併・分割）' },

  // ── Phase 15: 基礎知識・一般知識 ──
  { category: '基礎知識・足切り対策', topic: '行政書士法（業務範囲・欠格事由・懲戒・行政書士会の仕組み）' },
  { category: '基礎知識・足切り対策', topic: '個人情報保護法（定義・個人情報取扱事業者の義務・罰則・マイナンバー）' },
  { category: '基礎知識・足切り対策', topic: '情報通信・IT基礎（サイバーセキュリティ・電子署名・行政手続のデジタル化）' },
  { category: '基礎知識・足切り対策', topic: '政治・経済の頻出テーマ（国際機関・経済指標・日本の統治制度）' },
  { category: '基礎知識・足切り対策', topic: '文章理解の解き方（接続詞・空欄補充・内容把握・筆者の主張）' },
  { category: '基礎知識・足切り対策', topic: '一般知識の足切り突破戦略（14問中6問を確実に取る優先順位）' },

  // ── Phase 16: 記述式・多肢選択式対策 ──
  { category: '過去問演習', topic: '記述式対策①：行政法の記述問題の書き方（40字の構成と採点基準）' },
  { category: '過去問演習', topic: '記述式対策②：民法の記述問題と得点のコツ（条文・要件・効果）' },
  { category: '過去問演習', topic: '多肢選択式対策（行政法・憲法の選択問題・組み合わせ問題攻略）' },

  // ── Phase 17: 過去問解説 ──
  { category: '過去問演習', topic: '令和5年度本試験解説（行政法・頻出論点と難問の読み解き方）' },
  { category: '過去問演習', topic: '令和5年度本試験解説（民法・憲法・商法の重要問題）' },
  { category: '過去問演習', topic: '令和4年度本試験解説（行政法・出題傾向の変化と対策）' },
  { category: '過去問演習', topic: '令和4年度本試験解説（民法・憲法・難問対策）' },
  { category: '過去問演習', topic: '令和3年度本試験解説（行政法・主要論点の確認）' },

  // ── Phase 18: 直前期総まとめ ──
  { category: '過去問演習', topic: '苦手科目の最終チェックリスト（行政法・間違えやすい論点50選）' },
  { category: '過去問演習', topic: '苦手科目の最終チェックリスト（民法・頻出ひっかけ問題30選）' },
  { category: '過去問演習', topic: '行政法・民法の重要数字まとめ（時効期間・日数・割合の一覧）' },
  { category: '過去問演習', topic: '直前期の総まとめ（全科目・合格点108点を死守する最終戦略）' },
  { category: '過去問演習', topic: '本試験前日・当日の過ごし方（時間配分・マーク・見直しの手順）' },
]

export interface ArticleOutput {
  slug: string
  title: string
  body_mdx: string
  category: string
  seo_description: string
}

export async function factCheckArticle(
  article: ArticleOutput,
  client: Anthropic
): Promise<{ body_mdx: string; changes: string[] }> {
  const factcheckPrompt = sikakuFactcheckPrompt

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: factcheckPrompt,
    messages: [
      {
        role: 'user',
        content: `以下の記事をファクトチェックしてください。\n\n【タイトル】${article.title}\n【カテゴリ】${article.category}\n\n【本文】\n${article.body_mdx}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.warn('Factcheck: invalid JSON response, using original')
    return { body_mdx: article.body_mdx, changes: [] }
  }

  const parsed = JSON.parse(jsonMatch[0])
  return {
    body_mdx: parsed.body_mdx ?? article.body_mdx,
    changes: parsed.changes ?? [],
  }
}

// articleIndex: 何番目の記事か（0始まり）。DB記事数をもとに呼び出し側が渡す。
export async function generateArticle(now: Date, articleIndex: number): Promise<ArticleOutput> {
  const client = new Anthropic()
  const month = now.getMonth() + 1
  const day = now.getDate()

  const entry = CURRICULUM[articleIndex % CURRICULUM.length]
  const { category, topic } = entry

  // 次のトピック（予告用）
  const nextEntry = CURRICULUM[(articleIndex + 1) % CURRICULUM.length]
  const nextTopic = nextEntry.topic

  const systemPrompt = contentSystemPrompt

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `【今日のトピック】${topic}\n【フェーズ】${category}\n【現在】${month}月${day}日\n【次回の予告トピック】${nextTopic}\n\n上記のトピックで記事を書いてください。末尾の「次回の予告」では必ず次回トピックを明示してください。`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Claude returned invalid JSON for topic: ${topic}`)

  const parsed = JSON.parse(jsonMatch[0])
  const body = (parsed.body_mdx as string).replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
  return { ...parsed, body_mdx: body, category }
}

export { CURRICULUM }
