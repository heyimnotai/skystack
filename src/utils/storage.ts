import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = '@skystack_highscore';

export const saveHighScore = async (score: number) => {
  try {
    const currentHigh = await getHighScore();
    if (score > currentHigh) {
      await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
      return true; // New high score
    }
    return false;
  } catch (error) {
    console.warn('Error saving high score:', error);
    return false;
  }
};

export const getHighScore = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.warn('Error reading high score:', error);
    return 0;
  }
};
