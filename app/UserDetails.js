import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const UserDetails = () => {
  const { name, email } = useLocalSearchParams();

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>User Details</Text>
      <Text style={{ fontSize: 18 }}>Name: {name}</Text>
      <Text style={{ fontSize: 18 }}>Email: {email}</Text>
    </View>
  );
};

export default UserDetails;