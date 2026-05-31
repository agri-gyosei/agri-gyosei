import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '杉の根 ～梢は天に、根は地に～ | 時の杜',
  description: '三十年間、計画の内側にいた男が初めて地上を見た。イスラエルの諜報機関員・エレズが奥多摩の杉林で根を張り始める物語。五十音 百 著。',
  alternates: {
    canonical: 'https://agri-gyosei.com/story/suginone-kozue-wa-ten-ni',
  },
  openGraph: {
    title: '杉の根 ～梢は天に、根は地に～ | 時の杜',
    description: '三十年間、計画の内側にいた男が初めて地上を見た。イスラエルの諜報機関員・エレズが奥多摩の杉林で根を張り始める物語。五十音 百 著。',
    url: 'https://agri-gyosei.com/story/suginone-kozue-wa-ten-ni',
    siteName: '時の杜',
    locale: 'ja_JP',
    type: 'article',
    images: [{ url: 'https://agri-gyosei.com/images/suginone-cover.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '杉の根 ～梢は天に、根は地に～ | 時の杜',
    description: '三十年間、計画の内側にいた男が初めて地上を見た。イスラエルの諜報機関員・エレズが奥多摩の杉林で根を張り始める物語。五十音 百 著。',
    images: ['https://agri-gyosei.com/images/suginone-cover.png'],
  },
}

export default function SuginoneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
