// パレットアイテム型定義
export interface PaletteItem {
    type: string;
    name: string;
    icon: string;
    defaultProperties: Record<string, any>;
    defaultSize: { width: number; height: number };
}