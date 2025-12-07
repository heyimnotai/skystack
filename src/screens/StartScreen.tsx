import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming 
} from 'react-native-reanimated';
import { COLORS } from '../constants/gameConstants';

interface Props {
  onStart: () => void;
  highScore: number;
}

export const StartScreen: React.FC<Props> = ({ onStart, highScore }) => {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }), 
      -1, 
      true
    );
  }, []);

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>SKY</Text>
          <Text style={[styles.title, styles.titleAccent]}>STACK</Text>
        </View>
        
        <View style={styles.towerIcon}>
           {/* Simple tower illustration */}
           <View style={[styles.block, { width: 40, backgroundColor: COLORS.BLOCK_PALETTE[0] }]} />
           <View style={[styles.block, { width: 60, backgroundColor: COLORS.BLOCK_PALETTE[1] }]} />
           <View style={[styles.block, { width: 80, backgroundColor: COLORS.BLOCK_PALETTE[2] }]} />
        </View>

        <Text style={styles.highScore}>BEST: {highScore}</Text>

        <TouchableOpacity onPress={onStart} activeOpacity={0.8} style={styles.button}>
          <Animated.Text style={[styles.buttonText, animatedTextStyle]}>
            TAP TO START
          </Animated.Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
  },
  titleAccent: {
    color: COLORS.BLOCK_PALETTE[1],
    marginTop: -10,
  },
  towerIcon: {
    alignItems: 'center',
    marginBottom: 60,
  },
  block: {
    height: 25,
    marginBottom: 4,
    borderRadius: 4,
  },
  highScore: {
    color: '#cbd5e1',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 40,
    letterSpacing: 1,
  },
  button: {
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
