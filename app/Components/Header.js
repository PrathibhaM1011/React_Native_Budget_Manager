import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ title = "My App" }) => (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#6200ee',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Header;