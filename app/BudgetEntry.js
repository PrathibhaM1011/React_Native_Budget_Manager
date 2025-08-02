import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const BudgetEntry = () => {
  const [userName, setUserName] = useState('');
  const [budget, setBudget] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('loggedInUser');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || user.email || 'User');
          setLoggedInUser(user);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    fetchUser();
  }, []);

  const handleSaveBudget = async () => {
    if (budget.trim() === '') {
      Alert.alert('Please enter your budget');
      return;
    }

    try {
      const updatedUser = {
        ...loggedInUser,
        budget: budget
      };

      await AsyncStorage.setItem('userBudget', JSON.stringify(updatedUser));
      Alert.alert('Budget saved!', `₹${budget} set successfully`);

      setBudget('');
      router.push('/DailyExpenses');
    } catch (error) {
      console.error('Error saving budget:', error);
      Alert.alert('Something went wrong while saving your budget.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>👋 Hello, <Text style={styles.userName}>{userName}</Text></Text>

      <Text style={styles.label}>💸 What's your monthly budget?</Text>

      <TextInput
        placeholder='Enter your budget in ₹'
        value={budget}
        onChangeText={setBudget}
        style={styles.input}
        keyboardType='numeric'
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveBudget}>
        <Text style={styles.buttonText}>Save Budget</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BudgetEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FB',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  userName: {
    color: '#4B7BEC',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#4B7BEC',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center'
  }
});
