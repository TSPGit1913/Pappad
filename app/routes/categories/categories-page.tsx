import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/header';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router';

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  lastUpdated: string;
  color: string;
  status: 'active' | 'draft' | 'archived';
  createdBy: string;
}

interface Filter {
  status: string;
  searchQuery: string;
  sortBy: 'name' | 'lastUpdated' | 'itemCount';
  sortOrder: 'asc' | 'desc';
}

const CategoryPage: React.FC = () => {
    let navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: 'blue' });
  const [filters, setFilters] = useState<Filter>({
    status: 'all',
    searchQuery: '',
    sortBy: 'lastUpdated',
    sortOrder: 'desc'
  });

  useEffect(() => {
    // カテゴリデータの取得シミュレーション
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // APIリクエストのシミュレーション
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ダミーデータ
        const dummyCategories: Category[] = [
          {
            id: 'achievements',
            name: '実績',
            description: '実績に関するカテゴリです。',
            itemCount: 1,
            lastUpdated: '2025-05-15T10:30:00',
            color: 'blue',
            status: 'active',
            createdBy: 'Administrator'
          },
        ];
        
        setCategories(dummyCategories);
      } catch (error) {
        console.error('カテゴリの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
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
      'emerald': {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        border: 'border-emerald-200'
      },
      'amber': {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-200'
      },
      'gray': {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200'
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
  
  // カテゴリのステータスによるフィルタリング
  const filteredCategories = categories.filter(category => {
    // ステータスフィルター
    if (filters.status !== 'all' && category.status !== filters.status) {
      return false;
    }
    
    // 検索クエリフィルター
    if (filters.searchQuery && !category.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !category.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // ソート関数
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (filters.sortBy === 'name') {
      return filters.sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (filters.sortBy === 'lastUpdated') {
      return filters.sortOrder === 'asc'
        ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
        : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    } else if (filters.sortBy === 'itemCount') {
      return filters.sortOrder === 'asc'
        ? a.itemCount - b.itemCount
        : b.itemCount - a.itemCount;
    }
    return 0;
  });
  
  // フィルターの変更ハンドラー
  const handleFilterChange = (filterName: keyof Filter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // 削除モーダルの表示
  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };
  
  // カテゴリの削除処理
  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      // 実際のAPIコールの代わりにフロントエンドでのみ削除
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };
  
  // 新規カテゴリ作成処理
  const handleCreateCategory = () => {
    // バリデーション
    if (!newCategory.name.trim()) {
      return;
    }
    
    // 実際のAPIコールの代わりにフロントエンドでのみ追加
    const newCategoryItem: Category = {
      id: Math.random().toString(36).substr(2, 9), // 仮のID生成
      name: newCategory.name,
      description: newCategory.description,
      itemCount: 0,
      lastUpdated: new Date().toISOString(),
      color: newCategory.color,
      status: 'draft',
      createdBy: 'John Pappas' // 現在のユーザーとして仮定
    };
    
    setCategories(prev => [newCategoryItem, ...prev]);
    setNewCategory({ name: '', description: '', color: 'blue' });
    setShowCreateModal(false);
  };

  // ステータスバッジコンポーネント
  const StatusBadge = ({ status }: { status: string }) => {
    let classes = '';
    
    switch (status) {
      case 'active':
        classes = 'bg-green-100 text-green-800 border-green-200';
        break;
      case 'draft':
        classes = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        break;
      case 'archived':
        classes = 'bg-gray-100 text-gray-600 border-gray-200';
        break;
      default:
        classes = 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
        {status === 'active' ? '有効' : status === 'draft' ? '下書き' : 'アーカイブ'}
      </span>
    );
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
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">カテゴリ</h1>
                <p className="mt-1 text-sm text-gray-500">
                  カテゴリの作成、編集、管理を行います
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  新規カテゴリ
                </button>
              </div>
            </div>
          </div>
          
          {/* フィルターとソート */}
          <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* 検索フィルター */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="カテゴリを検索..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                {/* ステータスフィルター */}
                <div>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="all">すべてのステータス</option>
                    <option value="active">有効</option>
                    <option value="draft">下書き</option>
                    <option value="archived">アーカイブ</option>
                  </select>
                </div>
              </div>
              
              {/* ソートオプション */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">並び替え:</span>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-') as ['name' | 'lastUpdated' | 'itemCount', 'asc' | 'desc'];
                    setFilters(prev => ({
                      ...prev,
                      sortBy,
                      sortOrder
                    }));
                  }}
                  className="block w-48 py-2 pl-3 pr-10 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="lastUpdated-desc">最終更新日 (新しい順)</option>
                  <option value="lastUpdated-asc">最終更新日 (古い順)</option>
                  <option value="name-asc">名前 (昇順)</option>
                  <option value="name-desc">名前 (降順)</option>
                  <option value="itemCount-desc">アイテム数 (多い順)</option>
                  <option value="itemCount-asc">アイテム数 (少ない順)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* カテゴリリスト */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">カテゴリ一覧</h2>
              <span className="text-sm text-gray-500">合計 {filteredCategories.length} 件</span>
            </div>
            
            {loading ? (
              <div className="animate-pulse p-6">
                {[...Array(5)].map((_, i) => (
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
            ) : sortedCategories.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">カテゴリがありません</h3>
                <p className="mt-1 text-sm text-gray-500">
                  条件に一致するカテゴリがありません。新しいカテゴリを作成してください。
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    新規カテゴリ
                  </button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {sortedCategories.map((category) => {
                  const colorClasses = getCategoryColorClasses(category.color);
                  return (
                    <li key={category.id} className="transition-all duration-200 hover:bg-gray-50 cursor-pointer" 
                    onClick={() => navigate(`/categories/${category.id}`)}>
                      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center">
                        <div className="flex items-center min-w-0 flex-1">
                          <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                            <span className={`text-lg font-bold ${colorClasses.text}`}>
                              {category.name.substring(0, 2)}
                            </span>
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center mb-1">
                              <h3 className="text-base font-medium text-gray-900 truncate mr-3">
                                {category.name}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-500 truncate mb-1">
                              {category.description}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border} border`}>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                                {category.itemCount} アイテム
                              </span>
                              <span className="text-xs text-gray-500 ml-4">
                                作成者: {category.createdBy}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center justify-between sm:justify-end space-x-4">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">最終更新</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(category.lastUpdated)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleDeleteClick(category)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            
            {!loading && sortedCategories.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    すべて表示
                  </button>
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
            )}
          </div>
        </div>
      </main>
      
      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    カテゴリを削除
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      「{categoryToDelete?.name}」を削除しますか？この操作は取り消せません。このカテゴリに関連するすべてのアイテムも削除されます。
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                >
                  削除
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 新規カテゴリ作成モーダル */}
      {showCreateModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    新規カテゴリの作成
                  </h3>
                </div>
              </div>
              
              <div className="mt-5">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                      カテゴリ名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="カテゴリ名を入力"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700">
                      説明
                    </label>
                    <textarea
                      id="categoryDescription"
                      rows={3}
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="カテゴリの説明を入力"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="categoryColor" className="block text-sm font-medium text-gray-700">
                      カラー
                    </label>
                    <select
                      id="categoryColor"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="blue">ブルー</option>
                      <option value="indigo">インディゴ</option>
                      <option value="purple">パープル</option>
                      <option value="emerald">エメラルド</option>
                      <option value="amber">アンバー</option>
                      <option value="gray">グレー</option>
                      <option value="red">レッド</option>
                    </select>
                  </div>
                </form>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={!newCategory.name.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  作成
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;