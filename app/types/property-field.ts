// 設定パネルの型定義
export interface PropertyField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'color' | 'checkbox' | 'range';
    options?: string[];
}