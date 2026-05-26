// ルーティングと認証状態の管理
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'

// 認証済みユーザーのみアクセス可能なルート
function PrivateRoute({ session, children }) {
  if (session === undefined) return null // セッション確認中は何も表示しない
  return session ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 初回マウント時に現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 認証状態の変化（ログイン・ログアウト）を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン画面 */}
        <Route path="/login" element={<Login />} />
        {/* 会員登録画面 */}
        <Route path="/register" element={<Register />} />
        {/* 物件一覧（認証必須） */}
        <Route
          path="/properties"
          element={
            <PrivateRoute session={session}>
              <Properties />
            </PrivateRoute>
          }
        />
        {/* ルートはログイン状態に応じてリダイレクト */}
        <Route
          path="/"
          element={
            session === undefined
              ? null
              : session
              ? <Navigate to="/properties" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
