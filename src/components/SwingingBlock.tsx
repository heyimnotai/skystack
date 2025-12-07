import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
  useAnimatedReaction,
  cancelAnimation
} from 'react-native-reanimated';
import { BLOCK_HEIGHT, COLORS, SCREEN_WIDTH } from '../constants/gameConstants';

interface Props {
  width: number;
  color: string;
  duration: number;
  onDropRef: React.MutableRefObject<(() => void) | null>;
  onDrop: (x: number) => void;
  turnKey: number; // Used to reset animation
}

export const SwingingBlock: React.FC<Props> = ({
  width,
  color,
  duration,
  onDropRef,
  onDrop,
  turnKey
}) => {
  const translateX = useSharedValue(0);
  const maxTranslate = SCREEN_WIDTH - width;

  useEffect(() => {
    // Reset position
    translateX.value = 0;
    
    // Start animation loop
    translateX.value = withRepeat(
      withSequence(
        withTiming(maxTranslate, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false // don't reverse, the sequence handles return
    );
    
    // Assign trigger for parent to call
    onDropRef.current = () => {
      cancelAnimation(translateX);
      runOnJS(onDrop)(translateX.value);
    };

    return () => {
      cancelAnimation(translateX);
      onDropRef.current = null;
    };
  }, [width, duration, turnKey]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: width,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    >
       <View style={styles.shine} />
       <View style={styles.shadow} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BLOCK_HEIGHT,
    position: 'absolute',
    borderRadius: 6,
    borderCurve: 'continuous',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
});
