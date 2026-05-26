// 物件一覧画面（ログイン済みユーザーのみアクセス可能）
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import styles from './Properties.module.css'

// ダミーの物件データ
const PROPERTIES = [
  { id: 1, name: 'サンライズマンション 301', rent: 85000, area: '東京都渋谷区', type: '1LDK', size: '42㎡' },
  { id: 2, name: 'グリーンヒルズ 205',     rent: 72000, area: '東京都世田谷区', type: '1K',   size: '28㎡' },
  { id: 3, name: 'ブルースカイアパート 102',rent: 65000, area: '神奈川県横浜市', type: '1K',   size: '25㎡' },
  { id: 4, name: 'シーサイドコート 408',    rent: 120000,area: '神奈川県横浜市', type: '2LDK', size: '58㎡' },
  { id: 5, name: 'メープルレジデンス 501',  rent: 95000, area: '東京都目黒区',   type: '2DK',  size: '48㎡' },
  { id: 6, name: 'オーシャンビュー 303',    rent: 150000,area: '神奈川県鎌倉市', type: '2LDK', size: '65㎡' },
]

// 家賃を「¥85,000」形式にフォーマット
function formatRent(amount) {
  return `¥${amount.toLocaleString('ja-JP')}`
}

export default function Properties() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>不動産管理アプリ</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          ログアウト
        </button>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>物件一覧</h2>
        <p className={styles.count}>{PROPERTIES.length} 件</p>

        {/* 物件カード一覧 */}
        <div className={styles.grid}>
          {PROPERTIES.map((property) => (
            <div key={property.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>{property.type}</span>
              </div>
              <h3 className={styles.propertyName}>{property.name}</h3>
              <div className={styles.detail}>
                <span className={styles.icon}>📍</span>
                <span>{property.area}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.icon}>📐</span>
                <span>{property.size}</span>
              </div>
              <div className={styles.rent}>
                {formatRent(property.rent)}
                <span className={styles.rentUnit}> / 月</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
