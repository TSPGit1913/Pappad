import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import type { ComponentItem } from '../../types/component-item';
import type { PaletteItem } from '../../types/palette-item';
import type { SidebarTab } from '../../types/sidebar-tab';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from '../../components/builder/canvas';
import PaletteItemComponent from '../../components/builder/palette-Item';
import PropertyEditor from '../../components/builder/property-editor';


// パレットアイテムのリスト
const paletteItems: PaletteItem[] = [
    {
      type: 'button',
      name: 'ボタン',
      icon: 'Bt',
      defaultProperties: {
        text: 'ボタン',
        color: '#3B82F6',
        size: 'medium',
      },
      defaultSize: { width: 120, height: 40 }
    },
    {
      type: 'textInput',
      name: 'テキスト入力',
      icon: 'In',
      defaultProperties: {
        placeholder: 'ここに入力...',
        label: 'ラベル',
        required: false,
      },
      defaultSize: { width: 200, height: 60 }
    },
    {
      type: 'text',
      name: 'テキスト',
      icon: 'Tx',
      defaultProperties: {
        content: 'テキストを入力',
        fontSize: 16,
        color: '#000000',
      },
      defaultSize: { width: 200, height: 30 }
    },
    {
      type: 'image',
      name: '画像',
      icon: 'Im',
      defaultProperties: {
        url: 'https://via.placeholder.com/150',
        alt: '画像の説明',
      },
      defaultSize: { width: 150, height: 150 }
    },
    {
      type: 'container',
      name: 'コンテナ',
      icon: 'Co',
      defaultProperties: {
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
      },
      defaultSize: { width: 300, height: 200 }
    },
    {
      type: 'chart',
      name: 'チャート',
      icon: 'Ch',
      defaultProperties: {
        chartType: 'bar',
        dataSource: 'default',
      },
      defaultSize: { width: 300, height: 200 }
    }
];

// メインコンポーネント
const AppBuilderPage: React.FC = () => {
    const { categoryId, appId } = useParams<{ appId: string; categoryId: string; }>();
    
    // 状態管理
    const [activeTab, setActiveTab] = useState<SidebarTab>('palette');
    const [canvasItems, setCanvasItems] = useState<ComponentItem[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [nextId, setNextId] = useState(1);
    
    // グリッド設定
    const [gridSize, setGridSize] = useState({ x: 100, y: 80 });
    const [showGrid, setShowGrid] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(true);
  
    // 選択中のアイテム
    const selectedItem = canvasItems.find(item => item.id === selectedItemId) || null;
    
    // アイテムの追加
    const handleAddItem = useCallback((paletteItem: PaletteItem, position: { x: number; y: number }) => {
      const newItem: ComponentItem = {
        id: `item-${nextId}`,
        type: paletteItem.type,
        name: paletteItem.name,
        icon: paletteItem.icon,
        properties: { ...paletteItem.defaultProperties },
        position: snapToGrid ? snapPositionToGrid(position, gridSize) : position,
        size: { ...paletteItem.defaultSize }
      };
      
      setCanvasItems(prevItems => [...prevItems, newItem]);
      setSelectedItemId(newItem.id);
      setNextId(prevId => prevId + 1);
    }, [nextId, snapToGrid, gridSize]);
    
    // 位置をグリッドに合わせる関数
    const snapPositionToGrid = (position: { x: number; y: number }, size: { x: number; y: number }) => {
      return {
        x: Math.round(position.x / size.x) * size.x,
        y: Math.round(position.y / size.y) * size.y
      };
    };
    
    // アイテムの移動
    const handleMoveItem = (id: string, position: { x: number; y: number }) => {
      const snappedPosition = snapToGrid ? snapPositionToGrid(position, gridSize) : position;
      
      setCanvasItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, position: snappedPosition } 
            : item
        )
      );
    };
    
    // アイテムのリサイズ
    const handleResizeItem = (id: string, size: { width: number; height: number }) => {
      // グリッドサイズに合わせる
      const snappedSize = snapToGrid
        ? {
            width: Math.round(size.width / gridSize.x) * gridSize.x,
            height: Math.round(size.height / gridSize.y) * gridSize.y
          }
        : size;
        
      setCanvasItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, size: snappedSize } 
            : item
        )
      );
    };
    
    // アイテムのプロパティ変更
    const handlePropertyChange = (id: string, propertyName: string, value: any) => {
      setCanvasItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { 
                ...item, 
                properties: { 
                  ...item.properties, 
                  [propertyName]: value 
                } 
              } 
            : item
        )
      );
    };
    
    // アイテムの位置変更
    const handlePositionChange = (id: string, position: { x: number; y: number }) => {
      const snappedPosition = snapToGrid ? snapPositionToGrid(position, gridSize) : position;
      
      setCanvasItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, position: snappedPosition } 
            : item
        )
      );
    };
    
    // アイテムのサイズ変更
    const handleSizeChange = (id: string, size: { width: number; height: number }) => {
      const snappedSize = snapToGrid
        ? {
            width: Math.round(size.width / gridSize.x) * gridSize.x,
            height: Math.round(size.height / gridSize.y) * gridSize.y
          }
        : size;
        
      setCanvasItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, size: snappedSize } 
            : item
        )
      );
    };
    
    // アイテムの削除
    const handleDeleteItem = (id: string) => {
      setCanvasItems(prevItems => prevItems.filter(item => item.id !== id));
      if (selectedItemId === id) {
        setSelectedItemId(null);
      }
    };
    
    // グリッド設定変更ハンドラー
    const handleGridSettingsChange = (settings: { size?: { x: number; y: number }; show?: boolean; snap?: boolean }) => {
      if (settings.size !== undefined) setGridSize(settings.size);
      if (settings.show !== undefined) setShowGrid(settings.show);
      if (settings.snap !== undefined) setSnapToGrid(settings.snap);
    };
  
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen bg-gray-50">
          {/* パンくずリスト */}
          <nav className="flex p-1" aria-label="Breadcrumb">
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
                      <Link to={`/categories/${categoryId}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                          カテゴリ名
                      </span>
                      </Link>
                  </li>
                  <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                      アプリ名 - 編集
                    </span>
                  </div>
                </li>
              </ol>
          </nav>
          <main className="flex-1 flex overflow-hidden">
               
            {/* 左側のパネル（パレット） */}
            <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto flex flex-col">
              <div className="px-4 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">コンポーネント</h2>
                <p className="mt-1 text-sm text-gray-500">
                  ドラッグしてキャンバスに配置
                </p>
              </div>
  
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-1 mb-4">
                  <button
                    onClick={() => setActiveTab('palette')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'palette'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    パレット
                  </button>
                  <button
                    onClick={() => setActiveTab('layers')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'layers'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    レイヤー
                  </button>
                  <button
                    onClick={() => setActiveTab('assets')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'assets'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    アセット
                  </button>
                </div>
  
                {activeTab === 'palette' && (
                  <div className="mt-4">
                    {paletteItems.map((item) => (
                      <PaletteItemComponent
                        key={item.type}
                        item={item}
                      />
                    ))}
                  </div>
                )}
  
                {activeTab === 'layers' && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">
                      {canvasItems.length}個のコンポーネント
                    </p>
                    {canvasItems.map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex items-center p-2 mb-1 rounded cursor-pointer ${
                          selectedItemId === item.id
                            ? 'bg-indigo-50 border border-indigo-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        <div className="flex-shrink-0 h-6 w-6 rounded bg-gray-100 flex items-center justify-center mr-2">
                          <span className="text-gray-600 text-xs">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
  
                {activeTab === 'assets' && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      アセットライブラリ（準備中）
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  保存
                </button>
              </div>
            </div>
  
            {/* 中央のキャンバス */}
            <div className="flex-1 relative bg-gray-100 overflow-auto">
              
              <Canvas
                items={canvasItems}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onAddItem={handleAddItem}
                onMoveItem={handleMoveItem}
                gridSize={gridSize}
                showGrid={showGrid}
                snapToGrid={snapToGrid}
                onGridSettingsChange={handleGridSettingsChange}
              />
            </div>
  
            {/* 右側のプロパティパネル */}
            <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
              <div className="px-4 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">プロパティ</h2>
                <p className="mt-1 text-sm text-gray-500">
                  コンポーネントの設定
                </p>
              </div>
  
              <PropertyEditor
                selectedItem={selectedItem}
                onPropertyChange={handlePropertyChange}
                onPositionChange={handlePositionChange}
                onSizeChange={handleSizeChange}
                onDeleteItem={handleDeleteItem}
                snapToGrid={snapToGrid}
                gridSize={gridSize}
              />
            </div>
          </main>
        </div>
      </DndProvider>
    );
  };
  
  export default AppBuilderPage;