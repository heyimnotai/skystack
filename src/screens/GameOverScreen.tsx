import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay 
} from 'react-native-reanimated';
import { COLORS } from '../constants/gameConstants';

interface Props {
  score: number;
  highScore: number;
  isNewBest: boolean;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverScreen: React.FC<Props> = ({ 
  score, 
  highScore, 
  isNewBest, 
  onRetry,
  onHome 
}) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1);
    opacity.value = withDelay(300, withSpring(1));
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient
      colors={['#1a1a2e', '#000000']}
      style={styles.container}
    >
      <Animated.View style={[styles.card, animatedContainerStyle]}>
        <Text style={styles.title}>GAME OVER</Text>
        
        {isNewBest && (
          <View style={styles.newBestBadge}>
            <Text style={styles.newBestText}>NEW BEST!</Text>
          </View>
        )}

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statText}>Height: {score} Blocks</Text>
          <Text style={styles.statText}>Best: {highScore}</Text>
        </View>

        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>TAP TO RETRY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={onHome}>
          <Text style={styles.homeText}>🏠 Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 20,
    letterSpacing: 2,
  },
  newBestBadge: {
    backgroundColor: '#FFE66D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
    transform: [{ rotate: '-5deg' }]
  },
  newBestText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreLabel: {
    color: '#8892b0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  scoreValue: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '900',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  statText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: COLORS.BLOCK_PALETTE[1],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  retryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  homeButton: {
    padding: 10,
  },
  homeText: {
    color: '#8892b0',
    fontSize: 16,
  },
});
