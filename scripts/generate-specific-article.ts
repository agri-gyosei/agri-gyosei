import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { factCheckArticle } from '../lib/agents/content-agent'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^=]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

const TOPIC = process.argv[2]
const CATEGORY = process.argv[3] ?? '行政法・憲法'

if (!TOPIC) {
  console.error('Usage: npx tsx scripts/generate-specific-article.ts "トピック名" ["カテゴリ名"]')
  process.exit(1)
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const anthropic = new Anthropic()

  const now = new Date()
  const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const month = jstDate.getUTCMonth() + 1
  const day = jstDate.getUTCDate()

  console.log(`Generating article: "${TOPIC}" [${CATEGORY}]`)

  const promptPath = path.join(__dirname, '../lib/agents/prompts/content-system.txt')
  const systemPrompt = fs.readFileSync(promptPath, 'utf-8')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: `【今日のトピック】${TOPIC}\n【フェーズ】${CATEGORY}\n【現在】${month}月${day}日\n\n上記のトピックで記事を書いてください。` }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude returned invalid JSON')

  const parsed = JSON.parse(jsonMatch[0])
  const body = (parsed.body_mdx as string).replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
  const article = { ...parsed, body_mdx: body, category: CATEGORY }

  console.log(`Generated: "${article.title}"`)

  const { body_mdx: checkedBody, changes } = await factCheckArticle(article, anthropic)
  if (changes.length > 0) {
    console.log(`Factcheck fixed ${changes.length} issue(s):`)
    changes.forEach((c, i) => console.log(`  ${i + 1}. ${c}`))
    article.body_mdx = checkedBody
  } else {
    console.log('Factcheck: no issues found')
  }

  const displayTitle = `${month}/${day}｜${article.title}`

  const { error } = await supabase.from('articles').insert({
    slug: article.slug,
    title: displayTitle,
    body_mdx: article.body_mdx,
    category: article.category,
    seo_description: article.seo_description,
    is_member_only: false,
  })

  if (error) {
    if (error.code === '23505') {
      console.log(`Slug "${article.slug}" already exists, skipping.`)
    } else {
      throw error
    }
  } else {
    console.log(`Saved: ${article.slug}`)
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
