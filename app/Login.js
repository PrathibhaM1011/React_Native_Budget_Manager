import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (!userData) {
      alert('No user registered!');
      router.push('/NoData');
      return;
    }

    const user = JSON.parse(userData);

    if (user.email === email.trim() && user.password === password) {
      try {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
        console.log('User data saved successfully!');
        router.push('/BudgetEntry');
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    } else {
      alert('Invalid credentials!');
      router.push('/NoData');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Login</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: 300 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: 300 }}
        secureTextEntry
      />
      <Button
        title="Login"
        onPress={handleLogin}
        disabled={!email || !password}
      />
    </View>
  );
};

export default Login;
