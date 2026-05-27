// 物件カードコンポーネント — 編集・削除ボタン付き
import styles from './PropertyCard.module.css'

// 家賃を「¥85,000」形式にフォーマット
function formatRent(amount) {
  return `¥${Number(amount).toLocaleString('ja-JP')}`
}

export default function PropertyCard({ property, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.badge}>{property.layout}</span>
      </div>

      <h3 className={styles.propertyName}>{property.name}</h3>

      <div className={styles.detail}>
        <span className={styles.icon}>📍</span>
        <span>{property.area}</span>
      </div>

      <div className={styles.rent}>
        {formatRent(property.rent)}
        <span className={styles.rentUnit}> / 月</span>
      </div>

      {/* 編集・削除ボタン */}
      <div className={styles.actions}>
        <button onClick={onEdit} className={styles.editButton}>編集</button>
        <button onClick={onDelete} className={styles.deleteButton}>削除</button>
      </div>
    </div>
  )
}
