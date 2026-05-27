// 物件一覧画面 — SupabaseへのCRUD操作を管理するメインページ
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import PropertyCard from '../components/PropertyCard'
import PropertyForm from '../components/PropertyForm'
import styles from './Properties.module.css'

export default function Properties() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // フォームの表示制御
  // null     = フォームを非表示
  // 'add'    = 新規登録フォームを表示
  // object   = 編集フォームを表示（対象物件データ）
  const [formTarget, setFormTarget] = useState(null)

  // コンポーネントマウント時に物件一覧を取得
  useEffect(() => {
    fetchProperties()
  }, [])

  // Supabaseから物件一覧を取得（RLSにより自分の物件のみ返される）
  async function fetchProperties() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました。')
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  // 物件を新規登録する（INSERT）
  // PropertyFormから { name, rent, area, layout } を受け取る
  async function handleInsert(formData) {
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('properties')
      .insert({ ...formData, user_id: user.id })

    if (error) return '登録に失敗しました。'

    setFormTarget(null)
    fetchProperties()
    return null
  }

  // 物件情報を更新する（UPDATE）
  async function handleUpdate(formData) {
    const { error } = await supabase
      .from('properties')
      .update(formData)
      .eq('id', formTarget.id)

    if (error) return '更新に失敗しました。'

    setFormTarget(null)
    fetchProperties()
    return null
  }

  // 物件を削除する（DELETE）
  async function handleDelete(id) {
    if (!window.confirm('この物件を削除しますか？')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      setError('削除に失敗しました。')
    } else {
      // 再フェッチせずリストから即時除外してUIを更新
      setProperties(prev => prev.filter(p => p.id !== id))
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const isEditing = formTarget !== null && formTarget !== 'add'

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
        {/* タイトルと物件追加ボタン */}
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.sectionTitle}>物件一覧</h2>
            {!loading && <p className={styles.count}>{properties.length} 件</p>}
          </div>
          <button
            onClick={() => setFormTarget('add')}
            className={styles.addButton}
          >
            ＋ 物件を追加
          </button>
        </div>

        {/* エラーメッセージ */}
        {error && <p className={styles.error}>{error}</p>}

        {/* ローディング・空状態・物件グリッド */}
        {loading ? (
          <p className={styles.loadingText}>読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className={styles.emptyText}>
            登録された物件はありません。「＋ 物件を追加」から登録してください。
          </p>
        ) : (
          <div className={styles.grid}>
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={() => setFormTarget(property)}
                onDelete={() => handleDelete(property.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 物件登録・編集フォーム（モーダル） */}
      {formTarget !== null && (
        <PropertyForm
          initialData={isEditing ? formTarget : null}
          onSubmit={isEditing ? handleUpdate : handleInsert}
          onClose={() => setFormTarget(null)}
        />
      )}
    </div>
  )
}
