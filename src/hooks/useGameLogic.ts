import { useState, useRef, useCallback } from 'react';
import { runOnJS } from 'react-native-reanimated';
import {
  SCREEN_WIDTH,
  INITIAL_BLOCK_WIDTH,
  COLORS,
  PERFECT_TOLERANCE,
  BASE_SWING_DURATION,
  MIN_SWING_DURATION,
  SPEED_INCREMENT_STEP,
  SPEED_INCREMENT_FACTOR,
} from '../constants/gameConstants';
import { BlockData, GameState } from '../types';
import * as Haptics from 'expo-haptics';
import { playDropSound, playPerfectSound, playGameOverSound } from '../utils/sound';
import { saveHighScore } from '../utils/storage';

export const useGameLogic = (initialHighScore: number) => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(initialHighScore);
  const [stack, setStack] = useState<BlockData[]>([]);
  const [currentBlockWidth, setCurrentBlockWidth] = useState(INITIAL_BLOCK_WIDTH);
  const [perfectStreak, setPerfectStreak] = useState(0);
  const [showPerfectPopup, setShowPerfectPopup] = useState(false);
  const [swingDuration, setSwingDuration] = useState(BASE_SWING_DURATION);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Used to force a reset of the swinging block animation
  const [turnKey, setTurnKey] = useState(0);

  const startGame = useCallback(() => {
    setGameState('PLAYING');
    setScore(0);
    setStack([]);
    setCurrentBlockWidth(INITIAL_BLOCK_WIDTH);
    setPerfectStreak(0);
    setSwingDuration(BASE_SWING_DURATION);
    setTurnKey(0);
    setIsNewHighScore(false);
  }, []);

  const handleDrop = useCallback((currentX: number) => {
    if (gameState !== 'PLAYING') return;

    setStack((prevStack) => {
      // Base logic: first block always lands in center
      if (prevStack.length === 0) {
        const firstBlock: BlockData = {
          id: '0',
          width: INITIAL_BLOCK_WIDTH,
          x: (SCREEN_WIDTH - INITIAL_BLOCK_WIDTH) / 2,
          color: COLORS.BLOCK_PALETTE[0],
          isPerfect: true,
        };
        
        playDropSound();
        setScore(1);
        setTurnKey(k => k + 1);
        return [firstBlock];
      }

      const topBlock = prevStack[prevStack.length - 1];
      const diff = currentX - topBlock.x;
      const absDiff = Math.abs(diff);

      // Check for Game Over (Miss)
      if (absDiff >= topBlock.width) {
        handleGameOver(score);
        return prevStack;
      }

      // Calculate Overlap
      let newWidth = topBlock.width - absDiff;
      let newX = currentX;
      let isPerfect = false;

      // Perfect Drop Logic
      if (absDiff <= PERFECT_TOLERANCE) {
        newWidth = topBlock.width; // No penalty
        newX = topBlock.x; // Snap to aligned
        isPerfect = true;
      } else {
        // Trim Logic
        if (currentX < topBlock.x) {
          // Overhang on left, keep right side aligned
          newX = topBlock.x; 
        } else {
          // Overhang on right, keep left side aligned (which is currentX)
          newX = currentX;
        }
      }

      // Update State
      const nextColorIndex = (prevStack.length) % COLORS.BLOCK_PALETTE.length;
      const nextColor = COLORS.BLOCK_PALETTE[nextColorIndex];

      const newBlock: BlockData = {
        id: Math.random().toString(),
        width: newWidth,
        x: newX,
        color: nextColor,
        isPerfect,
      };

      // Scoring & Feedback
      if (isPerfect) {
        setPerfectStreak(p => p + 1);
        const streakBonus = perfectStreak >= 1 ? (perfectStreak + 1) * 2 : 2;
        setScore(s => s + 1 + streakBonus);
        setShowPerfectPopup(true);
        setTimeout(() => setShowPerfectPopup(false), 800);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        playPerfectSound();
      } else {
        setPerfectStreak(0);
        setScore(s => s + 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        playDropSound();
      }

      // Difficulty Increase
      setCurrentBlockWidth(newWidth);
      if ((prevStack.length + 1) % SPEED_INCREMENT_STEP === 0) {
        setSwingDuration(d => Math.max(MIN_SWING_DURATION, d * SPEED_INCREMENT_FACTOR));
      }

      setTurnKey(k => k + 1);
      return [...prevStack, newBlock];
    });
  }, [gameState, perfectStreak, score]);

  const handleGameOver = useCallback(async (finalScore: number) => {
    playGameOverSound();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setGameState('GAMEOVER');
    
    const isNew = await saveHighScore(finalScore);
    if (isNew) {
      setHighScore(finalScore);
      setIsNewHighScore(true);
    }
  }, []);

  const goToHome = useCallback(() => {
    setGameState('START');
  }, []);

  return {
    gameState,
    score,
    highScore,
    stack,
    currentBlockWidth,
    perfectStreak,
    showPerfectPopup,
    swingDuration,
    turnKey,
    isNewHighScore,
    startGame,
    handleDrop,
    goToHome,
  };
};
