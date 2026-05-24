import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const alt = 'ダーチャという生き方'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const { data } = await supabase
    .from('dacha_articles')
    .select('title, category')
    .eq('slug', slug)
    .single()

  return new ImageResponse(
    (
      <div
        style={{
          background: '#FAF7F2',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '10px',
            background: 'linear-gradient(to right, #C4714A, #E8B4B8)',
          }}
        />
        <div
          style={{
            background: '#E8B4B8',
            borderRadius: '24px',
            padding: '8px 28px',
            fontSize: 24,
            color: '#3D2B1F',
            marginBottom: '36px',
          }}
        >
          {data?.category ?? 'ダーチャ'}
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#3D2B1F',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '900px',
          }}
        >
          {data?.title ?? ''}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '44px',
            right: '64px',
            fontSize: 22,
            color: '#C4714A',
          }}
        >
          agri-gyosei.com/dacha
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
