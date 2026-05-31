import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '絵馬 ～広がる波紋～ | 時の杜',
  description: '2026年、イラン攻撃のニュースをきっかけに一人の日本人女性が気づき始める。遺跡の破壊、ユーフラテス川、黙示録の預言——すべてが一本の糸で繋がっていた。五十音 百 著。',
  alternates: {
    canonical: 'https://agri-gyosei.com/story/ema-hirogaru-hamon',
  },
  openGraph: {
    title: '絵馬 ～広がる波紋～ | 時の杜',
    description: '2026年、イラン攻撃のニュースをきっかけに一人の日本人女性が気づき始める。遺跡の破壊、ユーフラテス川、黙示録の預言——すべてが一本の糸で繋がっていた。五十音 百 著。',
    url: 'https://agri-gyosei.com/story/ema-hirogaru-hamon',
    siteName: '時の杜',
    locale: 'ja_JP',
    type: 'article',
    images: [{ url: 'https://agri-gyosei.com/images/ema-cover.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '絵馬 ～広がる波紋～ | 時の杜',
    description: '2026年、イラン攻撃のニュースをきっかけに一人の日本人女性が気づき始める。遺跡の破壊、ユーフラテス川、黙示録の預言——すべてが一本の糸で繋がっていた。五十音 百 著。',
    images: ['https://agri-gyosei.com/images/ema-cover.png'],
  },
}

export default function EmaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
