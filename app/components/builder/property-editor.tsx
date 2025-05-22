import type { ComponentItem } from '../../types/component-item';
import type { PropertyField } from '../../types/property-field';

// コンポーネントタイプごとのプロパティ定義
const componentProperties: Record<string, PropertyField[]> = {
    button: [
      { name: 'text', label: 'テキスト', type: 'text' },
      { name: 'color', label: '色', type: 'color' },
      { name: 'size', label: 'サイズ', type: 'select', options: ['small', 'medium', 'large'] },
    ],
    textInput: [
      { name: 'placeholder', label: 'プレースホルダー', type: 'text' },
      { name: 'label', label: 'ラベル', type: 'text' },
      { name: 'required', label: '必須', type: 'checkbox' },
    ],
    text: [
      { name: 'content', label: 'テキスト', type: 'text' },
      { name: 'fontSize', label: 'フォントサイズ', type: 'number' },
      { name: 'color', label: '色', type: 'color' },
    ],
    image: [
      { name: 'url', label: '画像URL', type: 'text' },
      { name: 'alt', label: '代替テキスト', type: 'text' },
    ],
    container: [
      { name: 'backgroundColor', label: '背景色', type: 'color' },
      { name: 'borderRadius', label: '角丸', type: 'range' },
    ],
    chart: [
      { name: 'chartType', label: 'グラフタイプ', type: 'select', options: ['bar', 'line', 'pie'] },
      { name: 'dataSource', label: 'データソース', type: 'text' },
    ]
};

type PropertyEditorProps = {
  selectedItem: ComponentItem | null;
  onPropertyChange: (id: string, propertyName: string, value: any) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onSizeChange: (id: string, size: { width: number; height: number }) => void;
  onDeleteItem: (id: string) => void;
  snapToGrid: boolean;
  gridSize: { x: number; y: number };
};

// プロパティエディタコンポーネント
const PropertyEditor: React.FC<PropertyEditorProps> = ({
    selectedItem,
    onPropertyChange,
    onPositionChange,
    onSizeChange,
    onDeleteItem,
    snapToGrid,
    gridSize
}) => {
    if (!selectedItem) {
      return (
        <div className="p-6 text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">コンポーネントが選択されていません</h3>
          <p className="mt-1 text-sm text-gray-500">
            キャンバス上のコンポーネントを選択してプロパティを編集します。
          </p>
        </div>
      );
    }
  
    const propertyFields = componentProperties[selectedItem.type] || [];
  
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">{selectedItem.name}のプロパティ</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
            {selectedItem.type}
          </span>
        </div>
  
        <div className="space-y-4">
          {/* 位置サイズ情報 */}
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">位置とサイズ</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">X位置</label>
                <input
                  type="number"
                  value={selectedItem.position.x}
                  onChange={(e) => {
                    const newX = parseInt(e.target.value, 10) || 0;
                    onPositionChange(selectedItem.id, { 
                      x: newX, 
                      y: selectedItem.position.y 
                    });
                  }}
                  className="block w-full px-2 py-1 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Y位置</label>
                <input
                  type="number"
                  value={selectedItem.position.y}
                  onChange={(e) => {
                    const newY = parseInt(e.target.value, 10) || 0;
                    onPositionChange(selectedItem.id, { 
                      x: selectedItem.position.x, 
                      y: newY 
                    });
                  }}
                  className="block w-full px-2 py-1 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">幅</label>
                <input
                  type="number"
                  value={selectedItem.size.width}
                  onChange={(e) => {
                    const newWidth = parseInt(e.target.value, 10) || 0;
                    onSizeChange(selectedItem.id, { 
                      width: newWidth, 
                      height: selectedItem.size.height 
                    });
                  }}
                  className="block w-full px-2 py-1 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">高さ</label>
                <input
                  type="number"
                  value={selectedItem.size.height}
                  onChange={(e) => {
                    const newHeight = parseInt(e.target.value, 10) || 0;
                    onSizeChange(selectedItem.id, { 
                      width: selectedItem.size.width, 
                      height: newHeight 
                    });
                  }}
                  className="block w-full px-2 py-1 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
  
          {/* コンポーネント固有のプロパティ */}
          {propertyFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
  
              {field.type === 'text' && (
                <input
                  type="text"
                  value={selectedItem.properties[field.name] || ''}
                  onChange={(e) => onPropertyChange(selectedItem.id, field.name, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
  
              {field.type === 'number' && (
                <input
                  type="number"
                  value={selectedItem.properties[field.name] || 0}
                  onChange={(e) => onPropertyChange(selectedItem.id, field.name, parseInt(e.target.value, 10) || 0)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
  
              {field.type === 'select' && (
                <select
                  value={selectedItem.properties[field.name] || ''}
                  onChange={(e) => onPropertyChange(selectedItem.id, field.name, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
  
              {field.type === 'color' && (
                <div className="flex items-center">
                  <input
                    type="color"
                    value={selectedItem.properties[field.name] || '#000000'}
                    onChange={(e) => onPropertyChange(selectedItem.id, field.name, e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 p-1"
                  />
                  <input
                    type="text"
                    value={selectedItem.properties[field.name] || '#000000'}
                    onChange={(e) => onPropertyChange(selectedItem.id, field.name, e.target.value)}
                    className="block w-full ml-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              )}
  
              {field.type === 'checkbox' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItem.properties[field.name] || false}
                    onChange={(e) => onPropertyChange(selectedItem.id, field.name, e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    {selectedItem.properties[field.name] ? '有効' : '無効'}
                  </span>
                </div>
              )}
  
              {field.type === 'range' && (
                <div className="flex flex-col">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={selectedItem.properties[field.name] || 0}
                    onChange={(e) => onPropertyChange(selectedItem.id, field.name, parseInt(e.target.value, 10) || 0)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">0</span>
                    <span className="text-xs text-gray-500">{selectedItem.properties[field.name] || 0}</span>
                    <span className="text-xs text-gray-500">20</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
  
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => onDeleteItem(selectedItem.id)}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            削除
          </button>
        </div>
      </div>
    );
};

export default PropertyEditor;