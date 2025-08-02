import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Register from './Register';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']} // cool dark gradient
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>🚀 Welcome to My App</Text>
        <Register />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
});
