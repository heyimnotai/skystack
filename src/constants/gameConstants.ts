import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const BLOCK_HEIGHT = 40;
export const INITIAL_BLOCK_WIDTH = width * 0.8;
export const PERFECT_TOLERANCE = 5; // Pixels
export const BASE_SWING_DURATION = 2000; // ms
export const MIN_SWING_DURATION = 800; // ms
export const SPEED_INCREMENT_STEP = 5; // Increase speed every 5 blocks
export const SPEED_INCREMENT_FACTOR = 0.95; // Reduce duration by 5%

export const COLORS = {
  BLOCK_PALETTE: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
  PERFECT_BORDER: '#FFFFFF',
  TEXT: '#FFFFFF',
  SHADOW: 'rgba(0,0,0,0.2)',
};

export const Z_INDEX = {
  BACKGROUND: 0,
  TOWER: 10,
  UI: 100,
  POPUP: 200,
};
