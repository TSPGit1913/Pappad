import { useDrag } from 'react-dnd';
import { useRef } from 'react';
import type { PaletteItem } from '../../types/palette-item';
import { ItemTypes } from '../../types/item';

// パレットアイテムコンポーネント
const PaletteItemComponent: React.FC<{item: PaletteItem;}> = ({ item }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.PALETTE_ITEM,
      item: { 
        type: ItemTypes.PALETTE_ITEM, 
        id: `palette-${item.type}`, 
        isNew: true,
        paletteItem: item
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
    
    drag(ref);
  
    return (
      <div
        ref={ref}
        className={`flex items-center p-3 mb-2 bg-white rounded-md shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : ''}`}
      >
        <div className="flex-shrink-0 h-8 w-8 rounded bg-indigo-100 flex items-center justify-center mr-3">
          <span className="text-indigo-600 text-sm font-medium">{item.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
        </div>
      </div>
    );
};

export default PaletteItemComponent;