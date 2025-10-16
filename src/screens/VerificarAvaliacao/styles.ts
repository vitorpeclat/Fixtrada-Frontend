import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 20,
    color: Colors.primary,
  },
});
