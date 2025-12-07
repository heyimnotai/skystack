import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor
} from 'react-native-reanimated';
import { useGameLogic } from '../hooks/useGameLogic';
import { Tower } from '../components/Tower';
import { SwingingBlock } from '../components/SwingingBlock';
import { BLOCK_HEIGHT, COLORS, SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants/gameConstants';
import { GameOverScreen } from './GameOverScreen';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  initialHighScore: number;
  onHome: () => void;
}

export const GameScreen: React.FC<Props> = ({ initialHighScore, onHome }) => {
  const {
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
    goToHome
  } = useGameLogic(initialHighScore);

  // Animation values
  const cameraY = useSharedValue(0);
  const blockDropTrigger = useRef<(() => void) | null>(null);

  // Background Colors Mapping based on blocks count
  const getGradientColors = () => {
    if (score < 10) return ['#FF9A9E', '#FECFEF']; // Dawn
    if (score < 25) return ['#4FACFE', '#00F2FE']; // Day
    if (score < 40) return ['#434343', '#000000']; // Sunset/Dark
    return ['#0f0c29', '#302b63', '#24243e']; // Night
  };

  // Start game on mount
  useEffect(() => {
    if (gameState === 'START') startGame();
  }, []);

  // Camera Logic
  useEffect(() => {
    // If stack gets too high (above 1/2 screen), move camera down
    const safeZone = SCREEN_HEIGHT * 0.4;
    const currentStackHeight = stack.length * BLOCK_HEIGHT;
    
    if (currentStackHeight > safeZone) {
      cameraY.value = withTiming(-(currentStackHeight - safeZone), { duration: 300 });
    } else {
      cameraY.value = withTiming(0, { duration: 300 });
    }
  }, [stack.length]);

  const worldStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cameraY.value }],
  }));

  const handleScreenPress = () => {
    if (blockDropTrigger.current && gameState === 'PLAYING') {
      blockDropTrigger.current();
    }
  };

  const handleInternalHome = () => {
    goToHome();
    onHome();
  };

  if (gameState === 'GAMEOVER') {
    return (
      <GameOverScreen 
        score={score} 
        highScore={highScore} 
        isNewBest={isNewHighScore}
        onRetry={startGame}
        onHome={handleInternalHome}
      />
    );
  }

  // Calculate position of the swinging block relative to the stack
  const nextBlockY = stack.length * BLOCK_HEIGHT;
  const nextColorIndex = (stack.length) % COLORS.BLOCK_PALETTE.length;
  const nextColor = COLORS.BLOCK_PALETTE[nextColorIndex];

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={handleScreenPress} 
      style={styles.touchableArea}
    >
       <LinearGradient
        colors={getGradientColors()}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      {/* Game World Container */}
      <Animated.View style={[styles.worldContainer, worldStyle]}>
        <Tower blocks={stack} />
        
        {/* The Swinging Block acts as the "Next" block */}
        <View style={{ position: 'absolute', bottom: nextBlockY, left: 0, right: 0, height: BLOCK_HEIGHT }}>
            <SwingingBlock
              key={turnKey} // Remount to reset animation
              turnKey={turnKey}
              width={currentBlockWidth}
              color={nextColor}
              duration={swingDuration}
              onDropRef={blockDropTrigger}
              onDrop={handleDrop}
            />
        </View>

        {/* Start Platform */}
        <View style={styles.platform} />
      </Animated.View>

      {/* UI Overlay */}
      <SafeAreaView style={styles.uiLayer} pointerEvents="none">
        <View style={styles.header}>
          <Text style={styles.scoreText}>SCORE: {score}</Text>
          {perfectStreak >= 2 && (
            <Text style={styles.streakText}>🔥 x{perfectStreak}</Text>
          )}
        </View>

        {showPerfectPopup && (
          <View style={styles.centerPopup}>
            <Text style={styles.perfectText}>PERFECT!</Text>
          </View>
        )}
      </SafeAreaView>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableArea: {
    flex: 1,
    overflow: 'hidden',
  },
  worldContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  uiLayer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scoreText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  streakText: {
    color: '#FFE66D',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  centerPopup: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  perfectText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#FF6B6B',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    letterSpacing: 2,
  },
  platform: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    right: -20,
    height: 50,
    backgroundColor: '#333',
  },
});
