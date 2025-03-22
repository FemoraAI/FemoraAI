import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from './colors';

const StatusCard = ({ daysCount, message, phase }) => {
  // Check if phase is an object and extract the name property
  const phaseName = typeof phase === 'object' && phase !== null ? phase.name : phase;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cycle Status</Text>
      <View style={styles.content}>
        <Text style={styles.phaseText}>{phaseName}</Text>
        {daysCount !== null && (
          <Text style={styles.daysCount}>{daysCount} days</Text>
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.textDark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  phaseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  daysCount: {
    fontSize: 12,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    color: COLORS.textLight,
  }
});

export default StatusCard;