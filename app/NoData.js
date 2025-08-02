import React from 'react';
import { View, Text, Image } from 'react-native';

const NoData = () => (
  <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: '#fff' }}>
    <Image
      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486790.png' }}
      style={{ width: 150, height: 150, marginBottom: 20 }}
      resizeMode="contain"
    />
    <Text style={{ fontSize: 20, color: 'red' }}>No data found for this user.</Text>
  </View>
);

export default NoData;