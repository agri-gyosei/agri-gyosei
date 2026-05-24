import { createClient } from '@supabase/supabase-js'
import { generateArticle } from '../lib/agents/content-agent'

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  console.log(`Generating article for ${month}月${day}日...`)
  const article = await generateArticle(now)

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
