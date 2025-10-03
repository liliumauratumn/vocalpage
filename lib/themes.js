// テーマカラー定義（一元管理）
export const themes = {
  blue: {
    name: 'CYAN',
    primary: '#00d4ff',
    secondary: '#0099ff',
    gradientStart: '#667eea',
    gradientEnd: '#00d4ff',
    overlay: 'rgba(0, 50, 100, 0.7)'
  },
  purple: {
    name: 'VIOLET',
    primary: '#d946ef',
    secondary: '#a855f7',
    gradientStart: '#8b5cf6',
    gradientEnd: '#ec4899',
    overlay: 'rgba(80, 0, 80, 0.7)'
  },
  orange: {
    name: 'SUNSET',
    primary: '#ff6b35',
    secondary: '#fbbf24',
    gradientStart: '#f59e0b',
    gradientEnd: '#ef4444',
    overlay: 'rgba(100, 30, 0, 0.7)'
  },
  // 将来の拡張用（簡単に追加できる）
  // green: { ... },
  // pink: { ... },
  // など30色でも簡単
}

// デフォルトテーマ
export const DEFAULT_THEME = 'blue'

// テーマ取得関数（存在しない場合はデフォルト）
export function getTheme(themeColor) {
  return themes[themeColor] || themes[DEFAULT_THEME]
}

// テーマ一覧を取得（プレビューボタン用）
export function getAllThemeKeys() {
  return Object.keys(themes)
}
