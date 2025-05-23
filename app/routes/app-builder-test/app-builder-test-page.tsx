import React, { useState, useRef, createContext, useContext } from 'react';
import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd';
import type { DropTargetMonitor, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { nanoid } from 'nanoid';

const ItemTypes = {
  CARD: 'card',
  ROW: 'row'
} as const;

interface CardItem {
    id: string;
    text: string;
}

interface RowItem {
  id: string;
  inRowData: CardItem[];
}

interface DragRowItem {
    id: string;
    index: number;
}

interface DragCardItem {
    id: string;
    index: number;
    rowId: string;
}

interface DropZoneInfo {
    rowId: string;
    index: number;
    position: { x: number; y: number; width: number; height: number };
}

interface DragContextType {
    nearestDropZone: { rowId: string; index: number } | null;
    setNearestDropZone: (zone: { rowId: string; index: number } | null) => void;
    dropZones: DropZoneInfo[];
    registerDropZone: (info: DropZoneInfo) => void;
    unregisterDropZone: (rowId: string, index: number) => void;
}

const DragContext = createContext<DragContextType>({
    nearestDropZone: null,
    setNearestDropZone: () => {},
    dropZones: [],
    registerDropZone: () => {},
    unregisterDropZone: () => {}
});

interface CardProps {
    rowId: string;
    id: string;
    text: string;
    index: number;
    moveCard: (fromRowId: string, fromCardIndex: number, toRowId: string, toCardIndex: number) => void;
}

const Card: React.FC<CardProps> = ({ rowId, id, text, index, moveCard }) => {
    const ref = useRef<HTMLDivElement>(null);
  
    const [{ isDragging }, drag] = useDrag<DragCardItem, unknown, { isDragging: boolean }>({
        type: ItemTypes.CARD,
        item: { id, index, rowId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [{ isOver }, drop] = useDrop<DragCardItem, unknown, { isOver: boolean }>({
        accept: ItemTypes.CARD,
        hover: (item: DragCardItem, monitor: DropTargetMonitor) => {
            if (!ref.current) {
                return;
            }
            
            // 異なる行または異なる位置の場合のみ移動
            const dragIndex = item.index;
            const hoverIndex = index;
            const dragRowId = item.rowId;
            const hoverRowId = rowId;
            
            // 同じ位置なら何もしない
            if (dragRowId === hoverRowId && dragIndex === hoverIndex) {
                return;
            }
            
            // 実際の移動処理
            moveCard(dragRowId, dragIndex, hoverRowId, hoverIndex);
            
            // ドラッグ中のアイテムの情報を更新
            item.index = hoverIndex;
            item.rowId = hoverRowId;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`
                border-2 border-gray-400 bg-white p-4 cursor-move
                transition-all duration-300 ease-in-out transform
                ${isDragging ? 'opacity-50 scale-105 shadow-lg' : 'opacity-100 scale-100'}
                ${isOver ? 'bg-blue-50 border-blue-400 translate-y-1' : ''}
                hover:shadow-md
            `}
            style={{
                minHeight: '80px',
                minWidth: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {text}
        </div>
    );
};

interface DropZoneProps {
    rowId: string;
    index: number;
    moveCard: (fromRowId: string, fromCardIndex: number, toRowId: string, toCardIndex: number) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ rowId, index, moveCard }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { nearestDropZone, registerDropZone, unregisterDropZone } = useContext(DragContext);
    
    const [{ isOver, canDrop }, drop] = useDrop<DragCardItem, unknown, { isOver: boolean; canDrop: boolean }>({
        accept: ItemTypes.CARD,
        drop: (item: DragCardItem) => {
            // ドロップ時の最終的な移動処理
            moveCard(item.rowId, item.index, rowId, index);
        },
        hover: (item: DragCardItem, monitor: DropTargetMonitor) => {
            if (!ref.current) {
                return;
            }
            
            // DropZoneへのhover時も位置を更新
            const dragIndex = item.index;
            const dragRowId = item.rowId;
            
            // 同じ行内で隣接する位置への移動は無視
            if (dragRowId === rowId && (dragIndex === index || dragIndex + 1 === index)) {
                return;
            }
            
            // 実際の移動処理
            moveCard(dragRowId, dragIndex, rowId, index);
            
            // ドラッグ中のアイテムの情報を更新
            if (dragRowId === rowId && dragIndex < index) {
                // 同じ行内で前から後ろへの移動の場合、インデックスを調整
                item.index = index - 1;
            } else {
                item.index = index;
            }
            item.rowId = rowId;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    drop(ref);

    // DropZoneの位置を登録
    React.useEffect(() => {
        if (ref.current && canDrop) {
            const rect = ref.current.getBoundingClientRect();
            registerDropZone({
                rowId,
                index,
                position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
            });
            return () => unregisterDropZone(rowId, index);
        }
    }, [canDrop, rowId, index, registerDropZone, unregisterDropZone]);

    // このDropZoneが最も近いかどうか
    const isNearest = nearestDropZone?.rowId === rowId && nearestDropZone?.index === index;
    const showDropZone = canDrop && isNearest;

    return (
        <div
            ref={ref}
            className={`
                transition-all duration-300 ease-in-out
                ${isOver && canDrop ? 'bg-blue-100 border-2 border-blue-400' : ''}
                ${showDropZone && !isOver ? 'border-2 border-dashed border-gray-300' : ''}
            `}
            style={{
                minHeight: showDropZone || isOver ? '80px' : '40px',
                width: showDropZone || isOver ? '80px' : '20px',
                marginLeft: showDropZone || isOver ? '8px' : '2px',
                marginRight: showDropZone || isOver ? '8px' : '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: showDropZone || isOver ? 1 : 0,
                pointerEvents: 'auto'
            }}
        >
            {(showDropZone || isOver) && (
                <div className="text-center">
                    <div className={`text-2xl ${isOver ? 'text-blue-500' : 'text-gray-400'}`}>
                        {isOver ? '↓' : '⊕'}
                    </div>
                    {isOver && (
                        <span className="text-xs text-blue-500">Drop</span>
                    )}
                </div>
            )}
        </div>
    );
};

interface RowProps {
    cards: CardItem[];
    rowId: string;
    rowIndex: number;
    moveCard: (fromRowId: string, fromCardIndex: number, toRowId: string, toCardIndex: number) => void;
    moveRow: (fromIndex: number, toIndex: number) => void;
}

const Row: React.FC<RowProps> = ({ cards, rowId, rowIndex, moveCard, moveRow }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag<DragRowItem, unknown, { isDragging: boolean }>({
        type: ItemTypes.ROW,
        item: { id: rowId, index: rowIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [{ isOver }, drop] = useDrop<DragRowItem, unknown, { isOver: boolean }>({
        accept: ItemTypes.ROW,
        hover: (item: DragRowItem, monitor: DropTargetMonitor) => {
            if (!ref.current) {
                return;
            }
            
            if (item.index !== rowIndex) {
                moveRow(item.index, rowIndex);
                item.index = rowIndex;
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`
                border-2 border-gray-600 bg-gray-50 p-2 mb-2 cursor-move
                transition-all duration-300 ease-in-out transform
                ${isDragging ? 'opacity-50 scale-105 shadow-lg' : 'opacity-100 scale-100'}
                ${isOver ? 'bg-blue-50 border-blue-400 translate-y-1' : ''}
                hover:shadow-md
                flex-shrink-0
            `}
            style={{
                minWidth: 'max-content'
            }}
        >
            <div className="text-sm text-gray-600 mb-2">{'row ' + (rowId)}</div>
            <div className="flex flex-row flex-nowrap items-center">
                {/* 行の先頭のドロップゾーン */}
                <DropZone rowId={rowId} index={0} moveCard={moveCard} />
                
                {cards.map((card, index) => (
                    <React.Fragment key={card.id}>
                        <Card
                            rowId={rowId}
                            id={card.id}
                            text={card.text}
                            index={index}
                            moveCard={moveCard}
                        />
                        {/* 各カードの後ろのドロップゾーン */}
                        <DropZone rowId={rowId} index={index + 1} moveCard={moveCard} />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// ドラッグ中のマウス位置を監視するコンポーネント
const DragLayerMonitor: React.FC = () => {
    const { setNearestDropZone, dropZones } = useContext(DragContext);
    
    const { item, itemType, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset()
    }));

    React.useEffect(() => {
        if (itemType === ItemTypes.CARD && currentOffset && dropZones.length > 0) {
            // 最も近いDropZoneを計算
            let nearestZone = null;
            let minDistance = Infinity;

            dropZones.forEach((zone) => {
                const centerX = zone.position.x + zone.position.width / 2;
                const centerY = zone.position.y + zone.position.height / 2;
                const distance = Math.sqrt(
                    Math.pow(currentOffset.x - centerX, 2) + 
                    Math.pow(currentOffset.y - centerY, 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestZone = { rowId: zone.rowId, index: zone.index };
                }
            });

            setNearestDropZone(nearestZone);
        } else {
            setNearestDropZone(null);
        }
    }, [currentOffset, dropZones, itemType, setNearestDropZone]);

    return null;
};

const AppBuilderTestPage: React.FC = () => {
    const [data, setData] = useState<RowItem[]>([
        { id: '1', inRowData: [
            { id: nanoid(10), text: 'div1' },
            { id: nanoid(10), text: 'div2' },
            { id: nanoid(10), text: 'div3' }
        ] },
        { id: '2', inRowData: [
            { id: nanoid(10), text: 'div4' },
            { id: nanoid(10), text: 'div5' },
            { id: nanoid(10), text: 'div6' }
        ] },
        { id: '3', inRowData: [] }, // 空の行
        { id: '4', inRowData: [
            { id: nanoid(10), text: 'div10' },
            { id: nanoid(10), text: 'div11' },
            { id: nanoid(10), text: 'div12' }
        ] },
        { id: '5', inRowData: [
            { id: nanoid(10), text: 'div13' },
            { id: nanoid(10), text: 'div14' },
            { id: nanoid(10), text: 'div15' }
        ] }
    ]);

    const [nearestDropZone, setNearestDropZone] = useState<{ rowId: string; index: number } | null>(null);
    const [dropZones, setDropZones] = useState<DropZoneInfo[]>([]);

    const registerDropZone = (info: DropZoneInfo) => {
        setDropZones(prev => [...prev.filter(z => !(z.rowId === info.rowId && z.index === info.index)), info]);
    };

    const unregisterDropZone = (rowId: string, index: number) => {
        setDropZones(prev => prev.filter(z => !(z.rowId === rowId && z.index === index)));
    };

    const moveCard = (fromRowId: string, fromCardIndex: number, toRowId: string, toCardIndex: number): void => {
        setData(prevData => {
            const updatedData = [...prevData];
            const fromRowIndex = updatedData.findIndex(row => row.id === fromRowId);
            const toRowIndex = updatedData.findIndex(row => row.id === toRowId);

            if (fromRowIndex === -1 || toRowIndex === -1) return prevData;

            // 異なる行間での移動
            if (fromRowIndex !== toRowIndex) {
                const fromRow = { ...updatedData[fromRowIndex] };
                const toRow = { ...updatedData[toRowIndex] };
                const newFromRowData = [...fromRow.inRowData];
                const newToRowData = [...toRow.inRowData];
                
                const [movedCard] = newFromRowData.splice(fromCardIndex, 1);
                newToRowData.splice(toCardIndex, 0, movedCard);
                
                fromRow.inRowData = newFromRowData;
                toRow.inRowData = newToRowData;
                
                updatedData[fromRowIndex] = fromRow;
                updatedData[toRowIndex] = toRow;
            } else {
                // 同じ行内での移動
                const row = { ...updatedData[fromRowIndex] };
                const newInRowData = [...row.inRowData];
                
                // カードを一時的に取り出す
                const [movedCard] = newInRowData.splice(fromCardIndex, 1);
                
                // 新しい位置に挿入
                // DropZoneのインデックスは「その位置の前に挿入」を意味するため、調整は不要
                newInRowData.splice(toCardIndex, 0, movedCard);
                
                row.inRowData = newInRowData;
                updatedData[fromRowIndex] = row;
            }

            return updatedData;
        });
    };

    const moveRow = (fromIndex: number, toIndex: number): void => {
        setData(prevData => {
            const updatedData = [...prevData];
            const [movedRow] = updatedData.splice(fromIndex, 1);
            updatedData.splice(toIndex, 0, movedRow);
            return updatedData;
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <DragContext.Provider value={{ 
                nearestDropZone, 
                setNearestDropZone, 
                dropZones, 
                registerDropZone, 
                unregisterDropZone 
            }}>
                <DragLayerMonitor />
                <div className="min-h-screen bg-gray-100 p-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">react-dnd with Nearest Drop Zone</h1>
                        <div className="border-2 border-gray-800 bg-white p-4 overflow-x-auto">
                            <div className="flex flex-col space-y-2 min-w-max">
                                {data.map((row, index) => (
                                    <Row
                                        key={row.id}
                                        cards={row.inRowData}
                                        rowId={row.id}
                                        rowIndex={index}
                                        moveCard={moveCard}
                                        moveRow={moveRow}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DragContext.Provider>
        </DndProvider>
    );
};

export default AppBuilderTestPage;