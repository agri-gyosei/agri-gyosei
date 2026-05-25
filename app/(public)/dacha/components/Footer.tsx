import Link from 'next/link'

export default function DachaFooter() {
  return (
    <footer className="text-white py-10 px-6" style={{ background: '#3D2B1F' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#E8B4B8' }}>
              ダーチャという生き方
            </h3>
            <ul className="space-y-2">
              <li><Link href="/dacha" className="text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }}>記事一覧トップ</Link></li>
              <li><Link href="/dacha?category=食料安全保障" className="text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }}>食料安全保障</Link></li>
              <li><Link href="/dacha?category=農地取得ガイド" className="text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }}>農地取得ガイド</Link></li>
              <li><Link href="/dacha?category=兼業農家入門" className="text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }}>兼業農家入門</Link></li>
              <li><Link href="/dacha?category=外資と農地問題" className="text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }}>外資と農地問題</Link></li>
              <li><Link href="/dacha?category=家庭菜園・保存食" className="text-sm hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }}>家庭菜園・保存食</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#E8B4B8' }}>
              姉妹サイト
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://agri-gyosei.com"
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  agri-gyosei.com（トップ）
                </a>
              </li>
              <li>
                <Link
                  href="/sikaku"
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  行政書士試験の勉強法
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#E8B4B8' }}>
              運営
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              兼業農家を支える行政書士事務所
              <br />
              <a href="https://agri-gyosei.com" className="hover:text-white transition-colors">
                agri-gyosei.com
              </a>
            </p>
          </div>
        </div>
        <div className="pt-6 text-center text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.35)' }}>
          © 2026 agri-gyosei.com
        </div>
      </div>
    </footer>
  )
}
