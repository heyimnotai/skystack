import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { StartScreen } from './src/screens/StartScreen';
import { GameScreen } from './src/screens/GameScreen';
import { getHighScore } from './src/utils/storage';

export default function App() {
  const [screen, setScreen] = useState<'START' | 'GAME'>('START');
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    loadScore();
  }, [screen]);

  const loadScore = async () => {
    const score = await getHighScore();
    setHighScore(score);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {screen === 'START' ? (
        <StartScreen 
          onStart={() => setScreen('GAME')} 
          highScore={highScore} 
        />
      ) : (
        <GameScreen 
          initialHighScore={highScore} 
          onHome={() => setScreen('START')} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
