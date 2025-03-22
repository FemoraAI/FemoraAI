// File: components/ReportCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../Component/colors';

const ReportCard = ({ title, subtitle, insights }) => {
  return (
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>{title}</Text>
      <Text style={styles.reportSubtitle}>{subtitle}</Text>
      {insights.map((insight, index) => (
        <View key={`insight-${index}`} style={styles.insightRow}>
          <MaterialIcons name="info" size={16} color={COLORS.primary} />
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  reportCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  reportSubtitle: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
});

export default ReportCard;