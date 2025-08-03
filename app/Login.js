import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      if (!usersData) {
        Alert.alert('No users found', 'Please register first.');
        router.push('/Register');
        return;
      }

      const users = JSON.parse(usersData);

      const matchedUser = users.find(
        (u) => u.email === email.trim() && u.password === password
      );

      if (!matchedUser) {
        Alert.alert('Invalid Credentials', 'Check your email or password.');
        return;
      }

      //  Save only the logged-in user's email in local storage
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(matchedUser));

      console.log('✅ Login successful:', matchedUser.email);

      //  Route based on budget availability
      if (matchedUser.budget && matchedUser.budget !== '') {
        router.push('/DailyExpenses');
      } else {
        router.push('/BudgetEntry');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'Something went wrong during login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="off"
        importantForAutofill="no"
      />

      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="off"
        importantForAutofill="no"
      />

      <TouchableOpacity
        style={[styles.button, (!email || !password) && styles.disabledButton]}
        onPress={handleLogin}
        disabled={!email || !password}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9e9e9e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
