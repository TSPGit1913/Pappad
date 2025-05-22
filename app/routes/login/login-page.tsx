// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from "react-router";


interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // ログイン処理のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ここで実際のAPIリクエストを行う
      // const response = await api.login(formData.email, formData.password);
      
      console.log('ログイン成功:', formData);
      // 成功時の処理（例：ダッシュボードへリダイレクト）
      navigate('/dashboard');
    } catch (err) {
      setError('メールアドレスまたはパスワードが正しくありません');
      console.error('ログインエラー:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6">      
      {/* ログインカード */}
      <div className="w-full max-w-md relative overflow-hidden">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300">
          <div className="p-8 sm:p-10">
            {/* ヘッダー */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16">
                {/* ローカルSVGファイルを使用する方法1: インポートしたSVGを直接イメージとして使用 */}
                <img src="/public/pappad.svg" alt="Logo" className="w-16 h-16" />
              </div>
              <p className="text-gray-500 text-sm">アカウントにログインして始めましょう</p>
            </div>
            
            {/* フォーム */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  メールアドレス
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="bg-white/50 border border-gray-200 text-gray-800 rounded-lg block w-full pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your-email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  パスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="bg-white/50 border border-gray-200 text-gray-800 rounded-lg block w-full pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    ログイン状態を保持
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  パスワードをお忘れですか？
                </a>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 ${isLoading ? 'opacity-80' : ''}`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? '処理中...' : 'ログイン'}
              </button>
            </form>
            
            {/* 区切り線 */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">または</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            
            {/* 新規登録リンク */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                アカウントをお持ちでないですか？ 
                <a href="#" className="font-medium text-blue-600 hover:text-blue-800 transition-colors ml-1">
                  新規登録
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;