import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import type { ComponentItem } from '../../types/component-item';
import type { PaletteItem } from '../../types/palette-item';
import type { SidebarTab } from '../../types/sidebar-tab';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from '../../components/builder/canvas';
import CanvasTest from '../../components/builder/canvas-test';
import PaletteItemComponent from '../../components/builder/palette-Item';
import PropertyEditor from '../../components/builder/property-editor';

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
              <div className="px-4">
                <h2 className="text-lg font-medium text-gray-900">パレット</h2>
              </div>
  
              <div className="p-2 flex-1 overflow-y-auto">
                <div className="mt-4">
                  <PaletteItemComponent />
                </div>
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
              
              {/* <Canvas
                items={canvasItems}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onAddItem={handleAddItem}
                onMoveItem={handleMoveItem}
                gridSize={gridSize}
                showGrid={showGrid}
                snapToGrid={snapToGrid}
                onGridSettingsChange={handleGridSettingsChange}
              /> */}
              <CanvasTest />
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