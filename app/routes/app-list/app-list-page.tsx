import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import Header from '../../components/layout/header';

interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  developer: string;
  rating: number;
  lastUpdated: string;
  status: 'published' | 'beta' | 'deprecated';
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

const AppListPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  console.log(categoryId);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'downloads' | 'lastUpdated'>('lastUpdated');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // カテゴリとアプリデータの取得（シミュレーション）
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // APIリクエストのシミュレーション
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // カテゴリ情報のシミュレーション
        const categoryData: Category = {
          id: categoryId || '',
          name: getCategoryName(categoryId || ''),
          description: getCategoryDescription(categoryId || ''),
          color: getCategoryColor(categoryId || '')
        };
        
        // アプリデータのシミュレーション
        const appsData: App[] = generateApps(categoryId || '');
        
        setCategory(categoryData);
        setApps(appsData);
      } catch (err) {
        console.error('データの取得に失敗しました:', err);
        setError('データの読み込み中にエラーが発生しました。再度お試しください。');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId]);
  
  // カテゴリ名の取得（モックデータ）
  const getCategoryName = (id: string): string => {
    const categories: Record<string, string> = {
      'achievements': '実績',
    };
    
    return categories[id] || 'カテゴリ不明';
  };
  
  // カテゴリ説明の取得（モックデータ）
  const getCategoryDescription = (id: string): string => {
    const descriptions: Record<string, string> = {
      'achievements': '実績に関するアプリケーション',
    };
    
    return descriptions[id] || 'このカテゴリの説明はありません';
  };
  
  // カテゴリカラーの取得（モックデータ）
  const getCategoryColor = (id: string): string => {
    const colors: Record<string, string> = {
      'achievements': 'blue',
    };
    
    return colors[id] || 'gray';
  };
  
  // モックアプリデータの生成
  const generateApps = (categoryId: string): App[] => {
    const appNames: Record<string, string[]> = {
      'achievements': ['実績入力(スマートフォン)', '実績入力(PC/タブレット)'],
    };
    
    const appList = appNames[categoryId] || ['App 1', 'App 2', 'App 3', 'App 4', 'App 5'];
    
    return appList.map((name, index) => {
      
      return {
        id: `${categoryId}_app_${index + 1}`,
        name,
        description: `${name}は、${getCategoryName(categoryId)}カテゴリの優れたアプリケーションです。ユーザーフレンドリーなインターフェースと豊富な機能を備えています。`,
        icon: name.substring(0, 2).toUpperCase(),
        developer: 'Administrator',
        rating: Math.floor(Math.random() * 20 + 30) / 10, // 3.0〜5.0のランダムな評価
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        status: ['published', 'beta', 'deprecated'][Math.floor(Math.random() * 3)] as 'published' | 'beta' | 'deprecated',
      };
    });
  };
  
  // カラーマッピング関数
  const getCategoryColorClasses = (color: string) => {
    const colorMap: {[key: string]: {bg: string, text: string, border: string, light: string}} = {
      'blue': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        light: 'bg-blue-50'
      },
      'indigo': {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
        light: 'bg-indigo-50'
      },
      'purple': {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
        light: 'bg-purple-50'
      },
      'emerald': {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        light: 'bg-emerald-50'
      },
      'amber': {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-200',
        light: 'bg-amber-50'
      },
      'rose': {
        bg: 'bg-rose-100',
        text: 'text-rose-800',
        border: 'border-rose-200',
        light: 'bg-rose-50'
      },
      'gray': {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        light: 'bg-gray-50'
      }
    };
    
    return colorMap[color] || colorMap['gray'];
  };
  
  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // ステータスバッジコンポーネント
  const StatusBadge = ({ status }: { status: string }) => {
    let classes = '';
    let label = '';
    
    switch (status) {
      case 'published':
        classes = 'bg-green-100 text-green-800 border-green-200';
        label = '公開中';
        break;
      case 'beta':
        classes = 'bg-blue-100 text-blue-800 border-blue-200';
        label = 'ベータ版';
        break;
      case 'deprecated':
        classes = 'bg-gray-100 text-gray-600 border-gray-200';
        label = '非推奨';
        break;
      default:
        classes = 'bg-gray-100 text-gray-800 border-gray-200';
        label = status;
    }
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
        {label}
      </span>
    );
  };
  
  // 星評価コンポーネント
  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="halfStarGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStarGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
        
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  // ダウンロード数フォーマット
  const formatDownloads = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };
  
  // アプリのフィルタリング
  const filteredApps = apps.filter(app => {
    // 検索クエリでフィルタリング
    if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !app.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // アプリのソート
  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'lastUpdated':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        return 0;
    }
  });
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* パンくずリスト */}
          <nav className="flex mb-5" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link to="/categories" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                    <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    カテゴリ
                    </Link>
                </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {category?.name || 'カテゴリ詳細'}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* カテゴリヘッダー */}
          {category && (
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div className="flex items-center">
                  <div className={`h-14 w-14 rounded-lg ${getCategoryColorClasses(category.color).bg} flex items-center justify-center mr-4`}>
                    <span className={`text-2xl font-bold ${getCategoryColorClasses(category.color).text}`}>
                      {category.name.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                      {category.name}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex">
                  <button 
                    onClick={() => navigate(`/categories/${categoryId}/create-app`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    新規アプリ
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* フィルターとソート */}
          <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-1 items-center">
                <div className="relative w-full md:max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="アプリを検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="block py-2 pl-3 pr-10 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="lastUpdated">最終更新日</option>
                    <option value="name">名前</option>
                    <option value="rating">評価</option>
                    <option value="downloads">ダウンロード数</option>
                  </select>
                </div>
                
                <div className="flex border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`p-2 ${viewType === 'grid' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`p-2 ${viewType === 'list' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* エラー表示 */}
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
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      再読み込み
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* アプリ一覧 */}
          {loading ? (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="animate-pulse">
                {viewType === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : sortedApps.length === 0 ? (
            <div className="bg-white shadow-sm rounded-lg py-12 px-4 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">アプリがありません</h3>
              <p className="mt-1 text-sm text-gray-500">
                条件に一致するアプリがありません。検索条件を変更するか、新しいアプリを追加してください。
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags([]);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  すべてのアプリを表示
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* グリッド表示 */}
              {viewType === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedApps.map((app) => {
                    const colorClasses = getCategoryColorClasses(category?.color || 'gray');
                    
                    return (
                      <div 
                        key={app.id} 
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="p-6">
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 h-14 w-14 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                              <span className={`text-xl font-bold ${colorClasses.text}`}>
                                {app.icon}
                              </span>
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                  {app.name}
                                </h3>
                                <StatusBadge status={app.status} />
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {app.developer}
                              </p>
                              <div className="mt-2 flex items-center">
                                <StarRating rating={app.rating} />
                              </div>
                            </div>
                          </div>
                          
                          <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                            {app.description}
                          </p>
                          
                          <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              最終更新: {formatDate(app.lastUpdated)}
                            </span>
                            <button
                              type="button"
                              onClick={() => navigate(`/app-builder/${categoryId}/${app.id}`)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              編集
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* リスト表示 */}
              {viewType === 'list' && (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {sortedApps.map((app) => {
                      const colorClasses = getCategoryColorClasses(category?.color || 'gray');
                      
                      return (
                        <li key={app.id} className="transition-colors duration-200 hover:bg-gray-50">
                          <div className="px-6 py-4">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${colorClasses.bg} flex items-center justify-center`}>
                                <span className={`text-lg font-bold ${colorClasses.text}`}>
                                  {app.icon}
                                </span>
                              </div>
                              <div className="ml-4 flex-1 min-w-0">
                                <div className="flex items-center">
                                  <h3 className="text-base font-medium text-gray-900 truncate mr-2">
                                    {app.name}
                                  </h3>
                                  <StatusBadge status={app.status} />
                                </div>
                                <div className="mt-1 flex items-center">
                                  <p className="text-sm text-gray-500 truncate mr-4">
                                    {app.developer}
                                  </p>
                                  <StarRating rating={app.rating} />
                                </div>
                              </div>
                              <div className="ml-4 flex-shrink-0 flex items-center">
                                <div className="text-right mr-4">
                                  <p className="text-xs text-gray-500">最終更新</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatDate(app.lastUpdated)}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => navigate(`/app-builder/${categoryId}/${app.id}`)}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  編集
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppListPage;