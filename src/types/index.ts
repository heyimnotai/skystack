export type GameState = 'START' | 'PLAYING' | 'GAMEOVER';

export interface BlockData {
  id: string;
  width: number;
  x: number;
  color: string;
  isPerfect?: boolean;
}

export interface GameStats {
  score: number;
  highScore: number;
  perfectStreak: number;
}

export type ThemeName = 'DAWN' | 'DAY' | 'SUNSET' | 'NIGHT';

export interface ThemeColors {
  background: [string, string]; // Gradient colors
  text: string;
}
