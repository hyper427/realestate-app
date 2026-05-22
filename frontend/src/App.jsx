// 家計簿アプリのメインコンポーネント
// レシートのアップロード・解析・一覧表示・グラフ表示を統括する

import { useEffect, useState } from 'react';
import CategoryChart from './components/CategoryChart';
import ExpenseList from './components/ExpenseList';
import MonthlyChart from './components/MonthlyChart';
import ReceiptUpload from './components/ReceiptUpload';
import './App.css';

// ローカルストレージのキー
const STORAGE_KEY = 'kakeibo_expenses';

// バックエンドの URL（Viteプロキシ経由のため空文字列）
const API_BASE = '';

export default function App() {
  // 支出データ（ローカルストレージから読み込み）
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 解析中フラグ
  const [isLoading, setIsLoading] = useState(false);
  // エラーメッセージ
  const [error, setError] = useState(null);
  // アクティブなタブ
  const [activeTab, setActiveTab] = useState('upload');

  // expenses が変わるたびにローカルストレージへ保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  // レシート画像を解析してデータを追加する
  const handleAnalyze = async (imageFile) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const res = await fetch(`${API_BASE}/api/analyze-receipt`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'サーバーエラーが発生しました');
      }

      const { data } = await res.json();

      // 一意のIDを付与してデータを追加
      const newExpense = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setExpenses((prev) => [newExpense, ...prev]);
      setActiveTab('list'); // 登録後は一覧タブへ移動
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 支出データを削除する
  const handleDelete = (id) => {
    if (confirm('このデータを削除しますか？')) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // タブの定義
  const tabs = [
    { id: 'upload', label: '📄 読み込み' },
    { id: 'list', label: `📋 一覧 (${expenses.length})` },
    { id: 'chart', label: '📊 グラフ' },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏠 家計簿アプリ</h1>
        <p>レシートを読み込んで支出を管理しましょう</p>
      </header>

      {/* タブナビゲーション */}
      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* エラー表示 */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* タブコンテンツ */}
      <main className="app-main">
        {activeTab === 'upload' && (
          <ReceiptUpload onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {activeTab === 'list' && (
          <ExpenseList expenses={expenses} onDelete={handleDelete} />
        )}

        {activeTab === 'chart' && (
          <div className="charts-grid">
            <CategoryChart expenses={expenses} />
            <MonthlyChart expenses={expenses} />
          </div>
        )}
      </main>
    </div>
  );
}
