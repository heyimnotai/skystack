import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlockData } from '../types';
import { Block } from './Block';
import { BLOCK_HEIGHT } from '../constants/gameConstants';

interface Props {
  blocks: BlockData[];
}

export const Tower: React.FC<Props> = ({ blocks }) => {
  return (
    <View style={styles.container}>
      {blocks.map((block, index) => (
        <View
          key={block.id}
          style={{
            position: 'absolute',
            bottom: index * BLOCK_HEIGHT,
            left: 0,
            right: 0,
            height: BLOCK_HEIGHT,
          }}
        >
          <Block data={block} isTop={index === blocks.length - 1} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
