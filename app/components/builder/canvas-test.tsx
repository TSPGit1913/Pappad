import { createContext, useContext, useState, useEffect, useRef, Fragment } from 'react';
import { DndProvider, useDrag, useDrop, useDragLayer } from 'react-dnd';
import type { DropTargetMonitor, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { nanoid } from 'nanoid';

// 型定義（既存のコードに合わせて調整）
const ItemTypes = {
    PALETTE_ITEM: 'palette_item',
    CANVAS_ITEM: 'canvas_item',
    ROW: 'row'
} as const;

interface ComponentItem {
    id: string;
    type: string;
    label: string;
    icon?: string;
}

interface PaletteItem {
    id: string;
    type: string;
    label: string;
    icon?: string;
}

interface DragRowItem {
    id: string;
    index: number;
}

interface DragItem {
    id: string;
    type: string;
    index: number;
    rowId: string;
}

interface RowItem {
    id: string;
    items: ComponentItem[];
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

// ドロップゾーンコンポーネント
interface DropZoneProps {
    rowId: string;
    index: number;
    onDrop: (item: DragItem, rowId: string, index: number) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ rowId, index, onDrop }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { nearestDropZone, registerDropZone, unregisterDropZone } = useContext(DragContext);
    
    const [{ isOver, canDrop }, drop] = useDrop<DragItem, unknown, { isOver: boolean; canDrop: boolean }>({
        accept: [ItemTypes.PALETTE_ITEM, ItemTypes.CANVAS_ITEM],
        drop: (item: DragItem, monitor) => {
            // ドロップイベントが親コンポーネントに伝播しないようにする
            monitor.didDrop();
            onDrop(item, rowId, index);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });

    drop(ref);

    // DropZoneの位置を登録
    useEffect(() => {
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
                ${isOver ? 'bg-blue-100 border-2 border-blue-400' : ''}
                ${showDropZone && !isOver ? 'border-2 border-dashed border-gray-300 bg-gray-50' : ''}
            `}
            style={{
                height: '70px',
                width: showDropZone || isOver ? '100px' : '20px',
                marginRight: showDropZone || isOver ? '8px' : '4px',
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

// キャンバスアイテムコンポーネント
interface CanvasItemProps {
    item: ComponentItem;
    rowId: string;
    index: number;
    moveItem: (fromRowId: string, fromItemIndex: number, toRowId: string, toItemIndex: number) => void;
}

const CanvasItem: React.FC<CanvasItemProps> = ({ item, rowId, index, moveItem }) => {
    const ref = useRef<HTMLDivElement>(null);
    
    const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
        type: ItemTypes.CANVAS_ITEM,
        item: { id: item.id, type: item.type, index, rowId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const [{ isOver }, drop] = useDrop<DragItem, unknown, { isOver: boolean }>({
        accept: ItemTypes.CANVAS_ITEM,
        hover: (item: DragItem, monitor: DropTargetMonitor) => {
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
            moveItem(dragRowId, dragIndex, hoverRowId, hoverIndex);
            
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
                h-[70px] min-w-[100px] px-4
                border-2 border-gray-300 bg-white
                flex items-center justify-center
                cursor-move transition-all duration-300
                ${isDragging ? 'opacity-50 scale-105 shadow-lg' : 'opacity-100 scale-100'}
                hover:shadow-md hover:border-gray-400
            `}
        >
            <span className="text-sm font-medium">{item.label + ' ' + index}</span>
        </div>
    );
};

// 行コンポーネント
interface RowProps {
    row: RowItem;
    rowId: string;
    rowIndex: number;
    onDrop: (item: DragItem, rowId: string, index: number) => void;
    moveItem: (fromRowId: string, fromItemIndex: number, toRowId: string, toItemIndex: number) => void;
    moveRow: (fromIndex: number, toIndex: number) => void;
}

const Row: React.FC<RowProps> = ({ row, rowId, rowIndex, onDrop, moveItem, moveRow }) => {
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
                h-[70px] bg-gray-50 border border-gray-200 mb-2 cursor-move
                ${isDragging ? 'opacity-50 scale-105 shadow-lg' : 'opacity-100 scale-100'}
                ${isOver ? 'bg-blue-50 border-blue-400 translate-y-1' : ''}
            `}
        >
            <div className="h-full flex items-center px-2">
                {/* 行の先頭のドロップゾーン */}
                <DropZone rowId={row.id} index={0} onDrop={onDrop} />
                
                {row.items.map((item, index) => (
                    <Fragment key={item.id}>
                        <CanvasItem item={item} rowId={row.id} index={index} moveItem={moveItem} />
                        {/* 各アイテムの後ろのドロップゾーン */}
                        <DropZone rowId={row.id} index={index + 1} onDrop={onDrop} />
                    </Fragment>
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

    useEffect(() => {
        if ((itemType === ItemTypes.CANVAS_ITEM || itemType === ItemTypes.PALETTE_ITEM) && currentOffset && dropZones.length > 0) {
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

const CanvasTest: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [nearestDropZone, setNearestDropZone] = useState<{ rowId: string; index: number } | null>(null);
    const [dropZones, setDropZones] = useState<DropZoneInfo[]>([]);
    const [rows, setRows] = useState<RowItem[]>([]);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const registerDropZone = (info: DropZoneInfo) => {
        setDropZones(prev => [...prev.filter(z => !(z.rowId === info.rowId && z.index === info.index)), info]);
    };

    const unregisterDropZone = (rowId: string, index: number) => {
        setDropZones(prev => prev.filter(z => !(z.rowId === rowId && z.index === index)));
    };

    const moveItem = (fromRowId: string, fromCardIndex: number, toRowId: string, toCardIndex: number): void => {
        setRows(prevRows => {
            const updatedRows = [...prevRows];
            const fromRowIndex = updatedRows.findIndex(row => row.id === fromRowId);
            const toRowIndex = updatedRows.findIndex(row => row.id === toRowId);

            if (fromRowIndex === -1 || toRowIndex === -1) return prevRows;

            // 異なる行間での移動
            if (fromRowIndex !== toRowIndex) {
                const fromRow = { ...updatedRows[fromRowIndex] };
                const toRow = { ...updatedRows[toRowIndex] };
                const newFromRowData = [...fromRow.items];
                const newToRowData = [...toRow.items];
                
                const [movedCard] = newFromRowData.splice(fromCardIndex, 1);
                newToRowData.splice(toCardIndex, 0, movedCard);
                
                fromRow.items = newFromRowData;
                toRow.items = newToRowData;
                
                updatedRows[fromRowIndex] = fromRow;
                updatedRows[toRowIndex] = toRow;
            } else {
                // 同じ行内での移動
                const row = { ...updatedRows[fromRowIndex] };
                const newInRowData = [...row.items];
                
                // カードを一時的に取り出す
                const [movedCard] = newInRowData.splice(fromCardIndex, 1);
                
                // 新しい位置に挿入
                // DropZoneのインデックスは「その位置の前に挿入」を意味するため、調整は不要
                newInRowData.splice(toCardIndex, 0, movedCard);
                
                row.items = newInRowData;
                updatedRows[fromRowIndex] = row;
            }

            return updatedRows;
        });
    };

    const moveRow = (fromIndex: number, toIndex: number): void => {
        setRows(prevRows => {
            const updatedRows = [...prevRows];
            const [movedRow] = updatedRows.splice(fromIndex, 1);
            updatedRows.splice(toIndex, 0, movedRow);
            return updatedRows;
        });
    };

    // キャンバスのドロップ設定
    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.PALETTE_ITEM, ItemTypes.CANVAS_ITEM],
        drop: (item: DragItem, monitor) => {
            // 具体的なDropZoneでドロップされた場合は処理しない
            if (monitor.didDrop()) {
                return;
            }
            
            // 最初の行を作成
            if (rows.length === 0) {
                const newRow: RowItem = {
                    id: nanoid(10),
                    items: [{
                        id: nanoid(10),
                        type: item.type,
                        label: `Item ${item.type}`
                    }]
                };
                setRows([newRow]);
            }
        },
        hover: (item: DragItem, monitor) => {
            // キャンバス上にドラッグ中で、まだ行がない場合
            if (rows.length === 0 && !monitor.didDrop()) {
                setIsDraggingOver(true);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }));

    drop(canvasRef);

    // アイテムのドロップハンドラー
    const handleDrop = (item: DragItem, rowId: string, index: number) => {
        setRows(prevRows => {
            const updatedRows = [...prevRows];
            const rowIndex = updatedRows.findIndex(r => r.id === rowId);
            
            if (rowIndex === -1) return prevRows;
            
            const newItem: ComponentItem = {
                id: nanoid(10),
                type: item.type,
                label: `Item ${item.type}`
            };

            console.log('handleDrop', item, rowId, index);
            console.log('newItem', newItem);
            
            // 既存のキャンバスアイテムの移動の場合
            if (item.rowId && item.index !== undefined) {
                const fromRowIndex = updatedRows.findIndex(r => r.id === item.rowId);
                if (fromRowIndex !== -1) {
                    // 元の位置から削除
                    const [movedItem] = updatedRows[fromRowIndex].items.splice(item.index, 1);
                    // 新しい位置に挿入
                    updatedRows[rowIndex].items.splice(index, 0, movedItem);
                }
            } else {
                // パレットからの新規追加
                updatedRows[rowIndex].items.splice(index, 0, newItem);
            }
            
            return updatedRows;
        });
    };

    useEffect(() => {
        if (!isOver) {
            setIsDraggingOver(false);
        }
    }, [isOver]);

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
                <div className="bg-gray-100 p-4">
                    <div ref={canvasRef} className="min-w-[375px] min-h-[640px] mx-auto shadow-sm border border-gray-200 bg-white p-4">
                        {rows.length === 0 && isDraggingOver && (
                            <div className="h-[70px] bg-gray-50 border-2 border-dashed border-gray-300 mb-2 flex items-center justify-center">
                                <span className="text-gray-500">Drop here to create first row</span>
                            </div>
                        )}
                        
                        {rows.map((row, index) => (
                            <Row 
                                key={row.id} 
                                row={row}
                                rowId={row.id}
                                rowIndex={index}
                                onDrop={handleDrop}
                                moveItem={moveItem}
                                moveRow={moveRow}
                            />
                        ))}
                    </div>
                </div>
            </DragContext.Provider>
        </DndProvider>
    );
}

export default CanvasTest;