import React from 'react';
import Header from '../../components/layout/header';


const SettingsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
      <div className="max-w-4xl mx-auto pt-16">        
        <div className="relative overflow-hidden rounded-xl shadow-xl">
          
          {/* コンテンツエリア */}
          <div className="bg-gray-50 p-6">
            {/* ページヘッダー */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">アカウントの設定と環境設定を管理します</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* サイドナビゲーション */}
              <div className="w-full md:w-48 flex-shrink-0">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <nav className="flex flex-col">
                    <div className="flex items-center px-4 py-3 text-sm font-medium bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500">
                      <svg className="mr-3 h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      プロフィール
                    </div>
                    <div className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      通知
                    </div>
                    <div className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      外観
                    </div>
                  </nav>
                </div>
              </div>
              
              {/* メインコンテンツエリア */}
              <div className="flex-1">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-medium text-gray-900">プロフィール設定</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      アカウント情報とユーザー設定を管理します
                    </p>
                  </div>
                  
                  <div className="px-6 py-4">
                    <div className="space-y-6">
                      {/* アバター */}
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                          JP
                        </div>
                        <div className="ml-5">
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              変更
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              削除
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            JPG、GIF、PNGのみ。最大サイズ: 2MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            名前
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              defaultValue="John Pappas"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            メールアドレス
                          </label>
                          <div className="mt-1">
                            <input
                              type="email"
                              defaultValue="john.pappas@example.com"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
                          >
                            キャンセル
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            保存
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;