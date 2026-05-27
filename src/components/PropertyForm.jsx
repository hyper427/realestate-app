// 物件登録・編集フォーム（モーダル形式）
// initialData が null の場合は新規登録、object の場合は編集
import { useState } from 'react'
import styles from './PropertyForm.module.css'

// 間取りの選択肢
const LAYOUT_OPTIONS = [
  'ワンルーム', '1K', '1DK', '1LDK',
  '2K', '2DK', '2LDK',
  '3DK', '3LDK', '4LDK以上',
]

export default function PropertyForm({ initialData, onSubmit, onClose }) {
  const isEditing = !!initialData

  const [form, setForm] = useState({
    name:   initialData?.name   ?? '',
    rent:   initialData?.rent   ?? '',
    area:   initialData?.area   ?? '',
    layout: initialData?.layout ?? '1LDK',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // rentを文字列から数値に変換して送信
    const data = { ...form, rent: parseInt(form.rent, 10) }
    const err = await onSubmit(data)

    if (err) {
      setError(err)
      setLoading(false)
    }
    // 成功時は親コンポーネントがモーダルを閉じる
  }

  return (
    // 背景クリックでモーダルを閉じる
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>
          {isEditing ? '物件を編集' : '物件を登録'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">物件名</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="例：サンライズマンション 301"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="rent">家賃（円）</label>
            <input
              id="rent"
              name="rent"
              type="number"
              value={form.rent}
              onChange={handleChange}
              placeholder="例：85000"
              min={0}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="area">エリア</label>
            <input
              id="area"
              name="area"
              type="text"
              value={form.area}
              onChange={handleChange}
              placeholder="例：東京都渋谷区"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="layout">間取り</label>
            <select
              id="layout"
              name="layout"
              value={form.layout}
              onChange={handleChange}
            >
              {LAYOUT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonRow}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? '保存中...' : isEditing ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
