import Link from 'next/link'

const GENRES = [
  { icon: '🌾', label: '食料安全保障', description: '輸入停止・ホルムズ海峡・食料危機' },
  { icon: '📋', label: '農地取得ガイド', description: '農地法・農業委員会・購入手順' },
  { icon: '🌿', label: 'ダーチャという生き方', description: 'ロシアの事例・日本への応用' },
  { icon: '🚜', label: '兼業農家入門', description: 'サラリーマン農家・週末農業' },
  { icon: '🏴', label: '外資と農地問題', description: '国土保全・外国資本による買い占め' },
  { icon: '🥕', label: '家庭菜園・保存食', description: '実践的な自給自足・備え' },
  { icon: '🏡', label: '農地×不動産', description: '農地価格・農地に家を建てる方法' },
]

type Props = {
  currentCategory?: string
}

export default function Sidebar({ currentCategory }: Props) {
  return (
    <div>
      <div className="text-white px-4 py-3 rounded-t-lg" style={{ background: '#C4714A' }}>
        <p className="font-bold text-sm tracking-wide">ジャンル別アーカイブ</p>
      </div>
      <div className="bg-white rounded-b-lg shadow-sm" style={{ border: '1px solid #F0D8D0', borderTop: 'none' }}>
        {GENRES.map((genre) => {
          const isActive = currentCategory === genre.label
          return (
            <Link
              key={genre.label}
              href={`/dacha?category=${encodeURIComponent(genre.label)}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors border-b last:border-b-0"
              style={{
                borderColor: '#F0D8D0',
                background: isActive ? '#FDF0EB' : 'transparent',
                color: '#3D2B1F',
              }}
            >
              <span className="text-lg">{genre.icon}</span>
              <div>
                <p className="text-sm font-medium" style={{ color: isActive ? '#C4714A' : '#3D2B1F' }}>
                  {genre.label}
                </p>
                <p className="text-xs text-gray-400">{genre.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
