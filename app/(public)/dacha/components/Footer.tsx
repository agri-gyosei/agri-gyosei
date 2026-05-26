import Link from 'next/link'

export default function DachaFooter() {
  return (
    <footer className="py-16 px-6" style={{ background: '#241714' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-4 uppercase" style={{ color: '#C9A8A5' }}>
              ダーチャという生き方
            </h3>
            <ul className="space-y-2.5">
              <li><Link href="/dacha" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>記事一覧トップ</Link></li>
              <li><Link href="/dacha?category=食料安全保障" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>食料安全保障</Link></li>
              <li><Link href="/dacha?category=農地取得ガイド" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>農地取得ガイド</Link></li>
              <li><Link href="/dacha?category=兼業農家入門" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>兼業農家入門</Link></li>
              <li><Link href="/dacha?category=外資と農地問題" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>外資と農地問題</Link></li>
              <li><Link href="/dacha?category=家庭菜園・保存食" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.65)' }}>家庭菜園・保存食</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-4 uppercase" style={{ color: '#C9A8A5' }}>
              姉妹サイト
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://agri-gyosei.com"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  agri-gyosei.com（トップ）
                </a>
              </li>
              <li>
                <Link
                  href="/sikaku"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  行政書士試験の勉強法
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-widest mb-4 uppercase" style={{ color: '#C9A8A5' }}>
              運営
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              兼業農家を支える行政書士事務所
              <br />
              <a href="https://agri-gyosei.com" className="hover:text-white transition-colors">
                agri-gyosei.com
              </a>
            </p>
          </div>
        </div>
        <div className="pt-6 text-center text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}>
          © 2026 agri-gyosei.com
        </div>
      </div>
    </footer>
  )
}
