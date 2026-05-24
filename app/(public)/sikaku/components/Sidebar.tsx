import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

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

type MonthlyArchive = {
  month: string
  count: number
}

type Props = {
  currentCategory?: string
  currentMonth?: string
}

function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split('-')
  return `${year}年${parseInt(month)}月`
}

export default async function Sidebar({ currentCategory, currentMonth }: Props) {
  let monthlyArchive: MonthlyArchive[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('published_at')
      .eq('is_member_only', false)

    if (data) {
      const monthCounts: Record<string, number> = {}
      for (const { published_at } of data) {
        const jstDate = new Date(new Date(published_at).getTime() + 9 * 60 * 60 * 1000)
        const ym = `${jstDate.getUTCFullYear()}-${String(jstDate.getUTCMonth() + 1).padStart(2, '0')}`
        monthCounts[ym] = (monthCounts[ym] ?? 0) + 1
      }
      monthlyArchive = Object.entries(monthCounts)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => b.month.localeCompare(a.month))
    }
  } catch {
    // Supabase not configured
  }

  return (
    <div className="space-y-4">
      {/* 学習カテゴリー */}
      <div>
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

      {/* 月別アーカイブ */}
      {monthlyArchive.length > 0 && (
        <div>
          <div className="bg-green-800 text-white px-4 py-3 rounded-t-lg">
            <p className="font-bold text-sm tracking-wide">📅 月別学習アーカイブ</p>
          </div>
          <div className="bg-white rounded-b-lg shadow-sm border border-gray-100">
            <ul className="divide-y divide-gray-100">
              {monthlyArchive.map(({ month, count }) => {
                const isActive = currentMonth === month
                return (
                  <li key={month}>
                    <Link
                      href={`/sikaku?month=${month}`}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                    >
                      <span>{formatMonthLabel(month)}</span>
                      <span className="text-xs text-gray-400">{count}記事</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
