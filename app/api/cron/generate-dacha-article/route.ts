import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { generateDachaArticle, factCheckDachaArticle } from '@/lib/agents/dacha-agent'

export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const now = new Date()
    const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000)

    const article = await generateDachaArticle(jstDate)

    const anthropic = new Anthropic()
    const { body_mdx: checkedBody, changes } = await factCheckDachaArticle(article, anthropic)
    if (changes.length > 0) {
      article.body_mdx = checkedBody
    }

    const { error } = await supabase.from('dacha_articles').insert({
      slug: article.slug,
      title: article.title,
      body_mdx: article.body_mdx,
      category: article.category,
      seo_description: article.seo_description,
      is_member_only: false,
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: `Slug "${article.slug}" already exists, skipped` })
      }
      throw error
    }

    return NextResponse.json({ success: true, slug: article.slug, title: article.title, changes })
  } catch (err) {
    console.error('[cron/generate-dacha-article]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
