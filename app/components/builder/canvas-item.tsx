import type { ComponentItem } from '../../types/component-item';
import { ItemTypes } from '../../types/item';
import { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import type { XYCoord } from 'dnd-core';
import type { DragItem } from '../../types/drug-item';
import type { DragSourceMonitor } from 'react-dnd';


// CanvasItemコンポーネントのprops型定義
type CanvasItemProps = {
    item: ComponentItem;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onMove: (id: string, position: { x: number; y: number }) => void;
    onResize?: (id: string, size: { width: number; height: number }) => void;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    gridSize: { x: number; y: number };
    snapToGrid: boolean;
}
  
// キャンバス上のコンポーネント
const CanvasItem: React.FC<CanvasItemProps> = ({ 
    item, 
    isSelected, 
    onSelect, 
    onMove, 
    onResize,
    canvasRef,
    gridSize,
    snapToGrid 
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [originalPosition, setOriginalPosition] = useState<{ x: number; y: number } | null>(null);
    
    // 位置をグリッドに合わせる関数
    const snapPositionToGrid = (position: { x: number; y: number }) => {
      if (!snapToGrid) return position;
      
      return {
        x: Math.round(position.x / gridSize.x) * gridSize.x,
        y: Math.round(position.y / gridSize.y) * gridSize.y
      };
    };
    
    const [{ isDragging, dragPosition }, drag] = useDrag(() => ({
      type: ItemTypes.CANVAS_ITEM,
      item: (monitor): DragItem => {
        const currentOffset = monitor.getClientOffset();
        const canvasBounds = canvasRef.current?.getBoundingClientRect();
        
        if (!canvasBounds || !currentOffset) {
          return { 
            type: ItemTypes.CANVAS_ITEM, 
            id: item.id,
            componentItem: item,
          };
        }
        
        // ドラッグ開始時の位置を保存
        const initialPosition = {
          x: item.position.x,
          y: item.position.y,
        };
        
        setOriginalPosition(initialPosition);
        
        return { 
          type: ItemTypes.CANVAS_ITEM, 
          id: item.id,
          componentItem: item,
          initialPosition,
        };
      },
      end: (_, monitor) => {
        const dropResult = monitor.getDropResult();
        
        if (!dropResult && originalPosition) {
          // ドロップされずにドラッグが終了した場合、元の位置に戻す
          onMove(item.id, originalPosition);
        } else if (dropResult) {
          // ドラッグが成功した場合、移動先の位置をグリッドに合わせる
          const snappedPosition = snapPositionToGrid(item.position);
          if (snappedPosition.x !== item.position.x || snappedPosition.y !== item.position.y) {
            onMove(item.id, snappedPosition);
          }
        }
        
        setOriginalPosition(null);
      },
      collect: (monitor: DragSourceMonitor) => {
        const clientOffset = monitor.getClientOffset();
        const canvasBounds = canvasRef.current?.getBoundingClientRect();
        
        if (!clientOffset || !canvasBounds) {
          return { isDragging: monitor.isDragging(), dragPosition: null };
        }

        const x = clientOffset.x - canvasBounds.left;
        const y = clientOffset.y - canvasBounds.top;

        return {
          isDragging: monitor.isDragging(),
          dragPosition: monitor.isDragging() ? {
            x: Math.round(x / gridSize.x) * gridSize.x,
            y: Math.round(y / gridSize.y) * gridSize.y
          } : null
        };
      },
    }), [item, onMove, canvasRef, originalPosition, snapToGrid, gridSize]);
  
    // リサイズハンドルの状態
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
    const [resizeStartPosition, setResizeStartPosition] = useState({ x: 0, y: 0 });
    
    // リサイズ開始ハンドラー
    const handleResizeStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      setIsResizing(true);
      setResizeStartSize({ width: item.size.width, height: item.size.height });
      setResizeStartPosition({ x: e.clientX, y: e.clientY });
      
      // マウスムーブとマウスアップのイベントリスナーを追加
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    };
    
    // リサイズ中ハンドラー
    const handleResizeMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      // サイズの変更量を計算
      const deltaX = e.clientX - resizeStartPosition.x;
      const deltaY = e.clientY - resizeStartPosition.y;
      
      // 新しいサイズを計算（グリッドにスナップ）
      const newWidth = Math.max(20, snapToGrid 
        ? Math.round((resizeStartSize.width + deltaX) / gridSize.x) * gridSize.x
        : resizeStartSize.width + deltaX);
      const newHeight = Math.max(20, snapToGrid 
        ? Math.round((resizeStartSize.height + deltaY) / gridSize.y) * gridSize.y
        : resizeStartSize.height + deltaY);
      
      // 親コンポーネントのサイズ変更関数を呼び出す
      if (typeof onResize === 'function') {
        onResize(item.id, { width: newWidth, height: newHeight });
      }
    };
    
    // リサイズ終了ハンドラー
    const handleResizeEnd = () => {
      setIsResizing(false);
      
      // イベントリスナーを削除
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  
    // アイテムの位置とスタイルを設定
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${item.position.x}px`,
      top: `${item.position.y}px`,
      width: `${item.size.width}px`,
      height: `${item.size.height}px`,
      border: isSelected ? '2px solid #4F46E5' : '1px solid #E5E7EB',
      backgroundColor: 'white',
      opacity: isDragging ? 0.5 : 1,
      zIndex: isSelected ? 10 : 1
    };
  
    // コンポーネントタイプによってレンダリングを分ける
    const renderComponentByType = () => {
      switch (item.type) {
        case 'button':
          return (
            <button
              className={`w-full h-full px-4 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors`}
              style={{ backgroundColor: item.properties.color }}
            >
              {item.properties.text}
            </button>
          );
        case 'textInput':
          return (
            <div className="w-full h-full">
              {item.properties.label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {item.properties.label}
                  {item.properties.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={item.properties.placeholder}
              />
            </div>
          );
        case 'text':
          return (
            <div
              className="w-full h-full flex items-center justify-start overflow-hidden"
              style={{
                color: item.properties.color,
                fontSize: `${item.properties.fontSize}px`
              }}
            >
              {item.properties.content}
            </div>
          );
        case 'image':
          return (
            <img
              className="w-full h-full object-cover rounded"
              src={item.properties.url}
              alt={item.properties.alt}
            />
          );
        case 'container':
          return (
            <div
              className="w-full h-full rounded flex items-center justify-center"
              style={{
                backgroundColor: item.properties.backgroundColor,
                borderRadius: `${item.properties.borderRadius}px`
              }}
            >
              <span className="text-sm text-gray-500">コンテナ</span>
            </div>
          );
        case 'chart':
          return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
              <span className="text-sm text-gray-500">
                {item.properties.chartType}グラフ
              </span>
            </div>
          );
        default:
          return <div className="w-full h-full bg-gray-200 rounded"></div>;
      }
    };
    
    // 選択中のアイテムに表示するリサイズハンドル
    const renderResizeHandle = () => {
      if (!isSelected) return null;
      
      return (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-600 cursor-se-resize"
          style={{ transform: 'translate(50%, 50%)' }}
          onMouseDown={handleResizeStart}
        />
      );
    };
  
    // ドラッグ参照をdivに適用
    drag(ref);
  
    return (
      <>
        {isDragging && dragPosition && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              width: `${item.size.width}px`,
              height: `${item.size.height}px`,
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              border: '1px dashed #4F46E5'
            }}
          />
        )}
        <div
          ref={ref}
          style={style}
          className={`rounded shadow-sm ${isSelected ? 'shadow-md' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.id);
          }}
        >
          {renderComponentByType()}
          {renderResizeHandle()}
        </div>
      </>
    );
};

export default CanvasItem;