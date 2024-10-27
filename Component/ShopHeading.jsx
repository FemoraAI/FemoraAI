import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShopHeading = ({ title }) => {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.heading}>{title}</Text>
            <View style={styles.line} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'grey',
        textAlign: 'center',
        fontFamily: 'Montserrat Alternates',
        marginHorizontal: 8,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'grey',
    },
});

export default ShopHeading;
