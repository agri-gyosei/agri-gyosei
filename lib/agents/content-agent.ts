import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

export const CATEGORIES = [
  '行政書士試験の頻出条文解説（民法・物権）',
  '行政書士試験の頻出条文解説（民法・債権）',
  '科目別勉強法（民法）',
  '科目別勉強法（行政法・行政手続法）',
  '科目別勉強法（行政法・行政事件訴訟法）',
  '科目別勉強法（憲法）',
  '科目別勉強法（商法・会社法）',
  '科目別勉強法（基礎法学）',
  '直前期の合格戦略',
  '試験当日の注意点',
  '合格体験記フォーマット',
  '農地法の基礎知識と行政書士の実務',
]

export interface ArticleOutput {
  slug: string
  title: string
  body_mdx: string
  category: string
  seo_description: string
}

export async function generateArticle(dayIndex: number): Promise<ArticleOutput> {
  const client = new Anthropic()
  const category = CATEGORIES[dayIndex % CATEGORIES.length]

  const promptPath = path.join(__dirname, 'prompts', 'content-system.txt')
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
        content: `カテゴリ「${category}」の記事を書いてください。`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Claude returned invalid JSON for category: ${category}`)

  const parsed = JSON.parse(jsonMatch[0])
  return { ...parsed, category }
}
