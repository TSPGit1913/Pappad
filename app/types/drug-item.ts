import type { ComponentItem } from './component-item';
import type { PaletteItem } from './palette-item';
import { ItemTypes } from './item';

// DragItem型定義
export type DragItem = {
    type: typeof ItemTypes.PALETTE_ITEM | typeof ItemTypes.CANVAS_ITEM;
    id?: string;
    paletteItem?: PaletteItem;
    componentItem?: ComponentItem;
    initialPosition?: { x: number; y: number };
    x?: number;
    y?: number;
};