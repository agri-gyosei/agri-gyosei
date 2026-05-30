import * as fs from 'fs'
import * as path from 'path'

// .env.local を手動でパース
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const SYSTEM_PROMPT = `あなたは行政書士試験の合格専門コーチです。
兼業農家など、忙しい社会人が「毎日1記事・5〜10分読むだけ」で半年後の本試験に合格できるよう、以下のルールで記事を書いてください。

## 基本方針
- 満点狙いではなく「合格点（180点中108点）を確実に取る」視点で書く
- 難しい法律用語は必ず平易な言葉で言い換える
- 農業・農地・日常生活に絡めた具体例を必ず1つ入れる
- 読了時間：5〜10分（文字数1500〜2500字）
- 結論を先に書いてから理由・例を説明する（忙しい人向け）

## 記事の構成（必ずこの順番で）

### 【今日のゴール】（3行以内）
今日の記事を読んで何ができるようになるか明示する。

### 【試験での重要度】
以下のいずれかを選んで表示する：
- ★★★ 必ず覚える（出題頻度が高く配点も高い）
- ★★☆ 余裕があれば（出題されるが得点源にならない）
- ★☆☆ 読み流しでOK（出題頻度が低い）
→ 出題頻度と配点の目安も1〜2文で書く

### 【本文】
- h2見出し・h3見出し・太字・表・リストを使って読みやすく構成する
- 農地・農業・兼業農家の場面を優先した具体例を入れる

### 【一問一答チェック】（3問）
- ○×形式または5択形式
- 試験本番レベルの難易度
- 答えと解説を直後に書く
- 問題の見出しは必ず \`<h3>Q1.問題文</h3>\` の形式にする

### 【今日のまとめ・次回の予告】（3行以内）

## 絶対に守るルール
- 「難しいから捨てる」は絶対に書かない
- 毎回「農業や農地に絡めた具体例」を必ず入れる

## 出力形式
必ず以下のJSON形式のみで返す。前置きや後書きは不要。
body_mdxには改行を\\nとしてエスケープすること。

{
  "slug": "kebab-case-english-slug",
  "title": "記事タイトル（40字以内）",
  "body_mdx": "## 【今日のゴール】\\n\\n本文...",
  "seo_description": "SEO用メタ説明文（120字以内）"
}`

async function main() {
  const client = new Anthropic()

  console.log('記事を生成中...')
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `【今日のトピック】満点ではなく合格点を狙う勉強法（行政書士試験の戦略的合格メソッド）
【フェーズ】合格戦略
【現在】5月29日
【次回の予告トピック】苦手科目の克服法と優先順位の付け方

上記のトピックで記事を書いてください。末尾の「次回の予告」では必ず次回トピックを明示してください。
合格点（180点中108点＝60%）を確実に取るための戦略・優先科目・時間配分を中心に解説してください。`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude returned invalid JSON')

  const parsed = JSON.parse(jsonMatch[0])
  const body = (parsed.body_mdx as string).replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
  const article = { ...parsed, body_mdx: body, category: '合格戦略' }

  console.log('生成完了:', article.slug)
  console.log('タイトル:', article.title)

  const displayTitle = `5/29｜${article.title}`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('articles').insert({
    slug: article.slug,
    title: displayTitle,
    body_mdx: article.body_mdx,
    category: article.category,
    seo_description: article.seo_description,
    is_member_only: false,
    published_at: '2026-05-29T05:00:00+09:00',
  })

  if (error) {
    if (error.code === '23505') {
      console.error(`スラッグ "${article.slug}" は既に存在します`)
    } else {
      throw error
    }
  } else {
    console.log('✅ Supabaseへの登録完了')
    console.log('表示タイトル:', displayTitle)
    console.log('slug:', article.slug)
    console.log('published_at: 2026-05-29')
  }
}

main().catch(console.error)
