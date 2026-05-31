import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '拓海 ～救世主はあなた自身～ | 時の杜',
  description: '普通の若者・山下拓海が気づき始める。救世主は、ずっと自分の内側にいたと。五十音 百 著。',
  alternates: {
    canonical: 'https://agri-gyosei.com/story/takumi-kyuseishu-wa-anata-jishin',
  },
  openGraph: {
    title: '拓海 ～救世主はあなた自身～ | 時の杜',
    description: '普通の若者・山下拓海が気づき始める。救世主は、ずっと自分の内側にいたと。五十音 百 著。',
    url: 'https://agri-gyosei.com/story/takumi-kyuseishu-wa-anata-jishin',
    siteName: '時の杜',
    locale: 'ja_JP',
    type: 'article',
    images: [{ url: 'https://agri-gyosei.com/images/takumi-cover.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '拓海 ～救世主はあなた自身～ | 時の杜',
    description: '普通の若者・山下拓海が気づき始める。救世主は、ずっと自分の内側にいたと。五十音 百 著。',
    images: ['https://agri-gyosei.com/images/takumi-cover.png'],
  },
}

export default function TakumiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
