import Link from 'next/link'

export default function SikakuFooter() {
  return (
    <footer className="text-white py-10 px-6" style={{ backgroundColor: '#1A2744' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#7A9BD4' }}>行政書士試験対策</h3>
            <ul className="space-y-2">
              <li><Link href="/sikaku" className="text-sm text-white/80 hover:text-white transition-colors">記事一覧トップ</Link></li>
              <li><Link href="/sikaku?category=行政法・憲法" className="text-sm text-white/80 hover:text-white transition-colors">行政法・憲法</Link></li>
              <li><Link href="/sikaku?category=民法" className="text-sm text-white/80 hover:text-white transition-colors">民法</Link></li>
              <li><Link href="/sikaku?category=商法・会社法" className="text-sm text-white/80 hover:text-white transition-colors">商法・会社法</Link></li>
              <li><Link href="/sikaku?category=基礎知識・足切り対策" className="text-sm text-white/80 hover:text-white transition-colors">基礎知識・足切り対策</Link></li>
              <li><Link href="/sikaku?category=過去問演習" className="text-sm text-white/80 hover:text-white transition-colors">過去問演習</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#7A9BD4' }}>姉妹サイト</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://agri-gyosei.com" className="text-sm text-white/80 hover:text-white transition-colors">
                  agri-gyosei.com（トップ）
                </a>
              </li>
              <li>
                <Link href="/dacha" className="text-sm text-white/80 hover:text-white transition-colors">
                  ダーチャという生き方
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#7A9BD4' }}>運営</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              兼業農家を支える行政書士事務所
              <br />
              <a href="https://agri-gyosei.com" className="hover:text-white/80 transition-colors">
                agri-gyosei.com
              </a>
            </p>
          </div>
        </div>
        <div className="pt-6 text-center text-xs text-white/40" style={{ borderTop: '1px solid rgba(122,155,212,0.2)' }}>
          © 2026 agri-gyosei.com
        </div>
      </div>
    </footer>
  )
}
