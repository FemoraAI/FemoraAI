import React from 'react';
import { View, Text, StyleSheet,Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './context/UserContext';
const PeriodTracker = () => {
  const navigation  = useNavigation(); 
  const { 
    getPeriodStatus, 
    getActiveDatesForMonth 
  } = useUser();
  const status = getPeriodStatus();

  return (
  <TouchableOpacity onPress={() => navigation.navigate('PeriodTracker')} >
    <View style={styles.container}>
        <View style={styles.textContainer}>
            <Text style={styles.periodText}>{status.message}</Text>
            <Text style={styles.daysText}>{status.daysCount}</Text>
            <Text style={styles.chanceText}>Click To Discover More About Your Cycle</Text>
        </View>
        <View>
            <Image source={require('../assets/calendar.png')} style={{ width: 100, height: 100 }} />
        </View>
    </View>
  </TouchableOpacity>
);
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E91E63', // Lighter shade of pink
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  textContainer: {
    flex: 1,
  },
  periodText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  daysText: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  chanceText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },
  iconContainer: {
    marginLeft: 20,
  },
});

export default PeriodTracker;