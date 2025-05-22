import type { ComponentItem } from '../../types/component-item';
import type { PaletteItem } from '../../types/palette-item';
import type { DragItem } from '../../types/drug-item';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../types/item';
import CanvasItem from './canvas-item';

// キャンバスコンポーネントのprops型定義
type CanvasProps = {
    items: ComponentItem[];
    selectedItemId: string | null;
    onSelectItem: (id: string | null) => void;
    onAddItem: (paletteItem: PaletteItem, position: { x: number; y: number }) => void;
    onMoveItem: (id: string, position: { x: number; y: number }) => void;
    gridSize: { x: number; y: number };
    showGrid: boolean;
    snapToGrid: boolean;
    onGridSettingsChange: (settings: { size?: { x: number; y: number }; show?: boolean; snap?: boolean }) => void;
  }
  
  // キャンバスコンポーネント
  const Canvas: React.FC<CanvasProps> = ({ 
    items, 
    selectedItemId, 
    onSelectItem, 
    onAddItem, 
    onMoveItem,
    gridSize,
    showGrid,
    snapToGrid,
    onGridSettingsChange
  }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    
    // 位置をグリッドに合わせる関数
    const snapPositionToGrid = (position: { x: number; y: number }) => {
      if (!snapToGrid) return position;
      
      return {
        x: Math.round(position.x / gridSize.x) * gridSize.x,
        y: Math.round(position.y / gridSize.y) * gridSize.y
      };
    };
    
    // キャンバスのドロップ設定
    const [{ isOver, dropPosition }, drop] = useDrop(() => ({
      accept: [ItemTypes.PALETTE_ITEM, ItemTypes.CANVAS_ITEM],
      drop: (item: DragItem, monitor) => {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;
        
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        
        // キャンバス内の相対位置を計算
        const x = clientOffset.x - canvasRect.left;
        const y = clientOffset.y - canvasRect.top;
        
        // グリッドにスナップする位置を計算
        const snappedPosition = snapPositionToGrid({ x, y });
        
        if (item.type === ItemTypes.PALETTE_ITEM && item.paletteItem) {
          // 新しいアイテムをドロップした場合
          onAddItem(item.paletteItem, snappedPosition);
        } else if (item.type === ItemTypes.CANVAS_ITEM && item.id) {
          // 既存のアイテムを移動した場合
          onMoveItem(item.id, snappedPosition);
        }
        
        return { dropped: true };
      },
      hover: (item: DragItem, monitor) => {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        const x = clientOffset.x - canvasRect.left;
        const y = clientOffset.y - canvasRect.top;

        const snappedPosition = {
          x: Math.round(x / gridSize.x) * gridSize.x,
          y: Math.round(y / gridSize.y) * gridSize.y
        };

        return snappedPosition;
      },
      collect: (monitor) => {
        const clientOffset = monitor.getClientOffset();
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        
        if (!clientOffset || !canvasRect) {
          return { isOver: monitor.isOver(), dropPosition: null };
        }

        const x = clientOffset.x - canvasRect.left;
        const y = clientOffset.y - canvasRect.top;

        return {
          isOver: monitor.isOver(),
          dropPosition: monitor.isOver() ? {
            x: Math.round(x / gridSize.x) * gridSize.x,
            y: Math.round(y / gridSize.y) * gridSize.y
          } : null
        };
      },
    }), [onAddItem, onMoveItem, snapToGrid, gridSize]);
  
    // キャンバスの背景をクリックした時の処理
    const handleCanvasClick = (e: React.MouseEvent) => {
      // クリックが直接キャンバスに対して行われた場合のみ選択を解除
      if (e.target === canvasRef.current) {
        onSelectItem(null);
      }
    };
  
    // グリッドの描画
    const renderGrid = () => {
      if (!showGrid) return null;
      
      const gridPattern = [];
      
      // 縦線
      for (let x = 0; x <= 1000; x += gridSize.x) {
        gridPattern.push(
          <line 
            key={`v-${x}`} 
            x1={x} 
            y1={0} 
            x2={x} 
            y2={1000} 
            stroke="#E5E7EB" 
            strokeWidth="1" 
          />
        );
      }
      
      // 横線
      for (let y = 0; y <= 1000; y += gridSize.y) {
        gridPattern.push(
          <line 
            key={`h-${y}`} 
            x1={0} 
            y1={y} 
            x2={1000} 
            y2={y} 
            stroke="#E5E7EB" 
            strokeWidth="1" 
          />
        );
      }
      
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {gridPattern}
        </svg>
      );
    };
  
    // ドロップ参照をキャンバスに適用
    drop(canvasRef);
  
    return (
      <div
        ref={canvasRef}
        className={`absolute inset-0 m-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${isOver ? 'bg-indigo-50' : ''}`}
        style={{ minHeight: '1000px', minWidth: '1000px', position: 'relative' }}
        onClick={handleCanvasClick}
      >
        {renderGrid()}
        {isOver && dropPosition && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${dropPosition.x}px`,
              top: `${dropPosition.y}px`,
              width: `${gridSize.x}px`,
              height: `${gridSize.y}px`,
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              border: '1px dashed #4F46E5'
            }}
          />
        )}
        {items.map((item) => (
          <CanvasItem
            key={item.id}
            item={item}
            isSelected={selectedItemId === item.id}
            onSelect={onSelectItem}
            onMove={onMoveItem}
            canvasRef={canvasRef}
            gridSize={gridSize}
            snapToGrid={snapToGrid}
          />
        ))}
      </div>
    );
  };

  export default Canvas;