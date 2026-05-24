import { createClient } from '@supabase/supabase-js'
import { generateArticle } from '../lib/agents/content-agent'

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  // Use day-of-year as index to rotate categories
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayIndex = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  console.log(`Generating article for day ${dayIndex}...`)
  const article = await generateArticle(dayIndex)

  console.log(`Generated: "${article.title}" [${article.category}]`)

  const { error } = await supabase.from('articles').insert({
    slug: article.slug,
    title: article.title,
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
    console.log(`Saved article: ${article.slug}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
