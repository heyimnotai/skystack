import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlockData } from '../types';
import { BLOCK_HEIGHT, COLORS } from '../constants/gameConstants';

interface Props {
  data: BlockData;
  isTop?: boolean;
}

export const Block: React.FC<Props> = React.memo(({ data, isTop }) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: data.width,
          left: data.x,
          backgroundColor: data.color,
          borderColor: data.isPerfect ? COLORS.PERFECT_BORDER : 'transparent',
          borderWidth: data.isPerfect ? 1.5 : 0,
          zIndex: isTop ? 10 : 1
        },
      ]}
    >
      <View style={styles.shine} />
      <View style={styles.shadow} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: BLOCK_HEIGHT,
    position: 'absolute',
    borderRadius: 6,
    borderCurve: 'continuous',
    overflow: 'hidden',
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
