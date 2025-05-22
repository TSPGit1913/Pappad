// コンポーネント型定義
export interface ComponentItem {
    id: string;
    type: string;
    name: string;
    icon: string;
    properties: Record<string, any>;
    position: { x: number; y: number };
    size: { width: number; height: number };
}