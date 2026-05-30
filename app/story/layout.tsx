import type { Metadata } from 'next'
import { Cormorant_Garamond, Zen_Old_Mincho } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const zenOldMincho = Zen_Old_Mincho({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-zen-old-mincho',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: '時の杜 | Toki no Mori',
  description: 'すべての物語は、想像の種から生まれる。時の杜が贈るフィクション作品レーベル。',
}

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${zenOldMincho.variable} story-root`}>
      {children}
    </div>
  )
}
