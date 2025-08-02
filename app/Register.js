import React, { useState } from 'react';
import { Button, Text, TextInput, View, StyleSheet,TouchableOpacity,} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = () => {
  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!Name.trim()) return alert("Please enter your name");
    if (!email.trim()) return alert("Please enter your email");
    if (!email.includes('@') || !email.includes('.')) return alert("Please enter a valid email");
    if (!password.trim() || password.length < 4) return alert("Please enter a password (min 4 chars)");

    const user = { name: Name, email, password };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    alert(`Welcome, ${Name}!`);
    router.push('/Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Full Name"
          value={Name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => router.push('/Login')}
          >
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Register;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    color: '#333',
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    color: '#4f46e5',
    fontWeight: 'bold',
  },
});
