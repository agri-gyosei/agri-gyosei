import Anthropic from '@anthropic-ai/sdk'
import * as fs from 'fs'
import * as path from 'path'

type Phase = {
  category: string
  topics: string[]
}

function getPhase(month: number, day: number): Phase {
  if (month <= 6) {
    return {
      category: '行政法・憲法',
      topics: [
        '行政法の頻出条文解説（行政手続法）',
        '行政手続法のポイント（申請・処分・聴聞）',
        '行政不服申立ての攻略法',
        '行政訴訟（取消訴訟）の攻略法',
        '行政訴訟（義務付け訴訟・差止訴訟）の攻略法',
        '憲法の重要判例解説（基本的人権）',
        '憲法・統治機構のポイント（国会・内閣・裁判所）',
      ],
    }
  }
  if (month === 7) {
    return {
      category: '民法',
      topics: [
        '民法の頻出条文解説（物権・不動産登記）',
        '民法の頻出条文解説（債権総論）',
        '民法の頻出条文解説（売買・贈与）',
        '民法の頻出条文解説（親族・相続）',
        'リーガルマインドで解く民法（誰を保護すべきか）',
        '民法の難所・ひっかけ問題対策',
      ],
    }
  }
  if (month === 8 && day <= 15) {
    return {
      category: '商法・会社法',
      topics: [
        '商法・会社法の頻出ポイントまとめ',
        '試験に出る会社法の最低限の知識',
        '会社の設立・機関・解散の基本',
        '株式会社の機関設計（取締役・監査役）',
      ],
    }
  }
  if (month === 8 && day > 15) {
    return {
      category: '基礎知識・足切り対策',
      topics: [
        '行政書士法の重要ポイント',
        '個人情報保護法の頻出問題',
        '文章理解の解き方・コツ',
        '14問中6問を確実に取る戦略',
        '一般知識の効率的な学習法',
      ],
    }
  }
  return {
    category: '過去問演習',
    topics: [
      '科目別・過去問頻出パターン解説（行政法）',
      '科目別・過去問頻出パターン解説（民法）',
      '科目別・過去問頻出パターン解説（憲法）',
      '年度別・過去問解説（直近3年）',
      '間違えやすいひっかけ問題まとめ',
      '直前期の総まとめ・弱点補強法',
      '苦手科目の最終チェックリスト',
    ],
  }
}

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
  const factcheckPath = path.join(__dirname, 'prompts', 'sikaku-factcheck.txt')
  const factcheckPrompt = fs.readFileSync(factcheckPath, 'utf-8')

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

export async function generateArticle(now: Date): Promise<ArticleOutput> {
  const client = new Anthropic()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )

  const phase = getPhase(month, day)
  const topic = phase.topics[dayOfYear % phase.topics.length]

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
        content: `【今日のトピック】${topic}\n【フェーズ】${phase.category}\n【現在】${month}月${day}日\n\n上記のトピックで記事を書いてください。`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Claude returned invalid JSON for topic: ${topic}`)

  const parsed = JSON.parse(jsonMatch[0])
  return { ...parsed, category: phase.category }
}
