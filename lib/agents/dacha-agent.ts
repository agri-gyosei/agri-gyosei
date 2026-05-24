import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

const GENRES = [
  {
    category: '食料安全保障',
    topics: [
      'ホルムズ海峡封鎖と日本の食料危機シナリオ',
      '食料自給率38%の現実と家庭でできる備え',
      '輸入停止リスクに備える食料安全保障の基本',
      '食料安全保障と国防：個人レベルで考える',
    ],
  },
  {
    category: '農地取得ガイド',
    topics: [
      '農地法とは？サラリーマン向け初心者完全ガイド',
      '農業委員会への申請から認定まで完全解説',
      'サラリーマンが農地を買う具体的な手順',
      '農地転用許可の流れと費用を行政書士が解説',
    ],
  },
  {
    category: 'ダーチャという生き方',
    topics: [
      'ダーチャとは何か？ロシアが飢えなかった理由',
      'アナスタシアとダーチャ文化：自然共生の思想',
      '日本版ダーチャのすすめ：農地付き週末別荘',
      'ダーチャで変わる家族の時間と暮らし方',
    ],
  },
  {
    category: '兼業農家入門',
    topics: [
      'サラリーマンのまま農家になる方法',
      '週末農業の始め方：必要な手続きと費用',
      '兼業農家の確定申告と農業所得の扱い',
      '兼業農家として農地を守る意義と喜び',
    ],
  },
  {
    category: '外資と農地問題',
    topics: [
      '外国資本による日本の農地買い占めの現状',
      '農地法の抜け穴と外資参入の実態',
      '国土保全のために個人ができること',
      '農地取得規制の最新動向と課題',
    ],
  },
  {
    category: '家庭菜園・保存食',
    topics: [
      '初心者が始めやすい家庭菜園5選',
      '保存食の基本：発酵・乾燥・瓶詰め',
      '家庭菜園で年間食費はどれだけ節約できるか',
      '農薬なし自然農法の基本と始め方',
    ],
  },
  {
    category: '農地×不動産',
    topics: [
      '農地と住宅地の価格差：知られていない事実',
      '農地に家を建てる方法：農業用施設として',
      '農地価格の相場と決まり方',
      '農地取得後の活用方法と資産価値',
    ],
  },
]

export interface DachaArticleOutput {
  slug: string
  title: string
  body_mdx: string
  category: string
  seo_description: string
}

export async function generateDachaArticle(now: Date): Promise<DachaArticleOutput> {
  const client = new Anthropic()
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )

  const flatTopics = GENRES.flatMap((g) =>
    g.topics.map((t) => ({ category: g.category, topic: t }))
  )
  const { category, topic } = flatTopics[dayOfYear % flatTopics.length]

  const promptPath = path.join(__dirname, 'prompts', 'dacha-system.txt')
  const systemPrompt = fs.readFileSync(promptPath, 'utf-8')

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
        content: `【今日のトピック】${topic}\n【ジャンル】${category}\n\n上記のトピックで記事を書いてください。`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Claude returned invalid JSON for topic: ${topic}`)

  const parsed = JSON.parse(jsonMatch[0])
  return { ...parsed, category }
}
