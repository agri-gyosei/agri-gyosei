import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '五色の詩 | 時の杜',
  description: '古代ムー大陸の記憶を継ぐ子供たちの物語。五つの色に秘められた謎が、現代と太古の世界を繋ぎ、失われた真実へと導く。五十音 百 著。',
  alternates: {
    canonical: 'https://agri-gyosei.com/story/goshiki-no-uta',
  },
  openGraph: {
    title: '五色の詩 | 時の杜',
    description: '古代ムー大陸の記憶を継ぐ子供たちの物語。五つの色に秘められた謎が、現代と太古の世界を繋ぎ、失われた真実へと導く。五十音 百 著。',
    url: 'https://agri-gyosei.com/story/goshiki-no-uta',
    siteName: '時の杜',
    locale: 'ja_JP',
    type: 'article',
    images: [{ url: 'https://agri-gyosei.com/images/goshiki-cover.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '五色の詩 | 時の杜',
    description: '古代ムー大陸の記憶を継ぐ子供たちの物語。五つの色に秘められた謎が、現代と太古の世界を繋ぎ、失われた真実へと導く。五十音 百 著。',
    images: ['https://agri-gyosei.com/images/goshiki-cover.png'],
  },
}

export default function GoshikiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
