import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BudgetSummary = () => {
  const [userBudgetData, setUserBudgetData] = useState(null);

useEffect(()=>{
    const getBudgetData = async ()=>{
        const data = await AsyncStorage.getItem('loggedInUser')
        if(data){
            setUserBudgetData(JSON.parse(data))
        }
    }
    getBudgetData();
},[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Budget Summary</Text>
      {userBudgetData && (
        <>
          <Text style={styles.text}>👤 {userBudgetData.name || userBudgetData.email}</Text>
          <Text style={styles.text}>💰 Monthly Budget: ₹{userBudgetData.budget}</Text>
        </>
      )}
    </View>
  );
};

export default BudgetSummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 24
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4B7BEC'
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333'
  }
});
