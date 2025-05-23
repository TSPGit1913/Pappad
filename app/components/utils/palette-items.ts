// パレットアイテムのリスト
import type { PaletteItem } from '../../types/palette-item';

export const paletteItems: PaletteItem[] = [
    {
      type: 'text',
      name: 'テキスト(1行)',
      icon: 'text_fields',
      defaultProperties: {
        content: 'テキストを入力',
        fontSize: 16,
        color: '#000000',
      },
      defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'textarea',
        name: 'テキスト(複数行)',
        icon: 'subject',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'number',
        name: '数値',
        icon: 'pin',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'date',
        name: '日付',
        icon: 'calendar_today',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'time',
        name: '時間',
        icon: 'schedule',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'datetime',
        name: '日付+時間',
        icon: 'event',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'checkbox',
        name: 'チェックボックス',
        icon: 'check_box',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'radio',
        name: 'ラジオボタン',
        icon: 'radio_button_checked',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'select',
        name: 'セレクトボックス',
        icon: 'arrow_drop_down_circle',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'formula',
        name: '計算',
        icon: 'functions',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
        type: 'lookup',
        name: 'ルックアップ',
        icon: 'search',
        defaultProperties: {
          content: 'テキストを入力',
          fontSize: 16,
          color: '#000000',
        },
        defaultSize: { width: 200, height: 30 }
    },
    {
      type: 'file',
      name: 'ファイル',
      icon: 'attach_file',
      defaultProperties: {
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
      },
      defaultSize: { width: 300, height: 200 }
    },
    {
      type: 'camera',
      name: '写真撮影',
      icon: 'camera',
      defaultProperties: {
        chartType: 'bar',
        dataSource: 'default',
      },
      defaultSize: { width: 300, height: 200 }
    },
    {
        type: 'video',
        name: '動画撮影',
        icon: 'videocam',
        defaultProperties: {
          chartType: 'bar',
          dataSource: 'default',
        },
        defaultSize: { width: 300, height: 200 }
      }
  ];