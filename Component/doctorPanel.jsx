import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DoctorDashboardScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Doctor Dashboard</Text>
            <Text style={styles.subtitle}>Welcome to the Doctor Dashboard!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default DoctorDashboardScreen;