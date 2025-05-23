import { useDrag } from 'react-dnd';
import { useRef } from 'react';
import type { PaletteItem } from '../../types/palette-item';
import { ItemTypes } from '../../types/item';
import { paletteItems } from '../utils/palette-items';


const Item: React.FC<{item: PaletteItem}> = ({ item }) => {
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
        className={`flex items-center p-2 mb-1 bg-white rounded-md shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : ''}`}
      >
        <span className="material-icons text-primary mr-2">{item.icon}</span>
        <span className="text-sm">{item.name}</span>
      </div>
    );
};

// パレットアイテムコンポーネント
const PaletteItemComponent: React.FC = () => {
    return (
      <div>
        {paletteItems.map((item) => (
          <Item key={item.type} item={item} />
        ))}
      </div>
    );
};

export default PaletteItemComponent;