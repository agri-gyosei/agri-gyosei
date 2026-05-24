import Link from 'next/link'

const CATEGORIES = [
  {
    icon: '📅',
    label: '学習ロードマップ（月別）',
    items: [
      '6月：行政法・憲法',
      '7月：民法',
      '8月：商法・会社法／基礎知識',
      '9～11月：過去問演習',
    ],
  },
  {
    icon: '📚',
    label: '科目別',
    items: [
      '行政法（最重要・最初に2周）',
      '民法（難所・リーガルマインドで攻略）',
      '憲法',
      '商法・会社法（基本だけでOK）',
      '基礎知識／一般知識（足切り注意）',
      '行政書士法・個人情報保護法',
      '文章理解',
    ],
  },
  {
    icon: '🎯',
    label: '合格戦略',
    items: [
      '満点ではなく合格点を狙う勉強法',
      '足切り対策（14問中6問正解が必須）',
      '直前期の苦手科目の復習法',
      '過去問の使い方',
    ],
  },
  {
    icon: '📝',
    label: '頻出条文・判例解説',
    items: [
      '行政書士試験の頻出条文解説（民法・物権）',
      '行政書士試験の頻出条文解説（民法・債権）',
    ],
  },
]

type Props = {
  currentCategory?: string
}

export default function Sidebar({ currentCategory }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-green-800 text-white px-4 py-3 rounded-t-lg">
        <p className="font-bold text-sm tracking-wide">半年合格ロードマップ</p>
      </div>

      <div className="bg-white rounded-b-lg shadow-sm border border-gray-100 divide-y divide-gray-100">
        {CATEGORIES.map((group) => (
          <div key={group.label} className="px-4 py-3">
            <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
              <span>{group.icon}</span>
              <span>{group.label}</span>
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = currentCategory === item
                return (
                  <li key={item}>
                    <Link
                      href={`/sikaku?category=${encodeURIComponent(item)}`}
                      className={`block text-sm px-2 py-1 rounded transition-colors ${
                        isActive
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                    >
                      {item}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
