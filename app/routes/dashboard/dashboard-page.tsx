import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/header';

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  lastUpdated: string;
  color: string;
}

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statsVisible, setStatsVisible] = useState(false);

  // アニメーション用の状態
  useEffect(() => {
    // データ読み込みのシミュレーション
    const timer = setTimeout(() => {
      setLoading(false);
      // エラー表示のためのダミーエラー
      setError('カテゴリの読み込み中にエラーが発生しました');
      
      // ダミーデータ（本来はAPIから取得）
      setCategories([
        {
          id: '1',
          name: 'マーケティング',
          description: 'マーケティング関連のカテゴリ',
          itemCount: 24,
          lastUpdated: '2025-05-15T10:30:00',
          color: 'blue'
        },
        {
          id: '2',
          name: '開発',
          description: '開発関連のカテゴリ',
          itemCount: 18,
          lastUpdated: '2025-05-18T14:20:00',
          color: 'indigo'
        },
        {
          id: '3',
          name: 'デザイン',
          description: 'デザイン関連のカテゴリ',
          itemCount: 12,
          lastUpdated: '2025-05-20T09:15:00',
          color: 'purple'
        }
      ]);
    }, 1000);

    // 統計情報の表示用タイマー
    const statsTimer = setTimeout(() => {
      setStatsVisible(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(statsTimer);
    };
  }, []);

  // カラーマッピング関数
  const getCategoryColorClasses = (color: string) => {
    const colorMap: {[key: string]: {bg: string, text: string, border: string}} = {
      'blue': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200'
      },
      'indigo': {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200'
      },
      'purple': {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200'
      },
      'green': {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        border: 'border-emerald-200'
      },
      'red': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200'
      }
    };
    
    return colorMap[color] || colorMap['blue'];
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ページヘッダー */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">ダッシュボード</h1>
                <p className="mt-1 text-sm text-gray-500">
                  カテゴリとコンテンツの概要を確認できます
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  新規カテゴリ
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                  フィルター
                </button>
              </div>
            </div>
          </div>
          
          {/* 統計カード */}
          <div className={`grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                  <div className="ml-5">
                    <div className="text-sm font-medium text-gray-500">
                      総カテゴリ数
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                      8
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div className="ml-5">
                    <div className="text-sm font-medium text-gray-500">
                      総アイテム数
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                      142
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                    </svg>
                  </div>
                  <div className="ml-5">
                    <div className="text-sm font-medium text-gray-500">
                      アクティブユーザー
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                      12
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="ml-5">
                    <div className="text-sm font-medium text-gray-500">
                      最終更新
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                      2時間前
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-8 animate-fade-in-up">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    エラーが発生しました
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    {error}
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      再読み込み
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* カテゴリ一覧 */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">最近のカテゴリ</h2>
              <span className="text-sm text-gray-500">合計 {categories.length} 件</span>
            </div>
            
            <div className="bg-white divide-y divide-gray-200">
              {loading ? (
                <div className="animate-pulse p-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 mb-6">
                      <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {categories.map((category, index) => {
                    const colorClasses = getCategoryColorClasses(category.color);
                    return (
                      <li key={category.id} className="transition-all duration-200 hover:bg-gray-50">
                        <div className="px-6 py-5 flex items-center justify-between cursor-pointer">
                          <div className="flex items-center min-w-0">
                            <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                              <span className={`text-lg font-bold ${colorClasses.text}`}>
                                {category.name.substring(0, 2)}
                              </span>
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="flex items-center">
                                <h3 className="text-base font-medium text-gray-900 truncate">
                                  {category.name}
                                </h3>
                                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border} border`}>
                                  {category.itemCount} アイテム
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 truncate">
                                {category.description}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-500">最終更新</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(category.lastUpdated)}
                              </p>
                            </div>
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  すべてのカテゴリを表示
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-1.5 rounded-md bg-white border border-gray-300 text-gray-500 hover:text-gray-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="p-1.5 rounded-md bg-white border border-gray-300 text-gray-500 hover:text-gray-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;