import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, { G, Text as SvgText, Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useUser } from './context/UserContext';
import RecommendedReads from '../Component/RecommendedReads'; // Import the independent component

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

// Earth tone color scheme
const COLORS = {
  background: 'transparent',
  primary: '#A96E5B',
  secondary: '#7A9E7E',
  accent: '#D4A373',
  text: '#5D473A',
  lightText: '#8B735B',
  white: '#FFFFFF',
};

const PHASES = {
  menstrual: { name: 'Menstrual Phase', color: COLORS.primary },
  follicular: { name: 'Follicular Phase', color: COLORS.secondary },
  ovulation: { name: 'Ovulation Phase', color: COLORS.accent },
  luteal: { name: 'Luteal Phase', color: COLORS.lightText },
};

const PeriodTracker = () => {
  const { userData, isInPeriod } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(moment());

  const cycleLength = parseInt(userData.cycleDays) || 28;
  const periodLength = parseInt(userData.periodDays) || 5;

  const getCurrentPhase = (date) => {
    const cycleDay = date.diff(moment(userData.lastPeriodStart), 'days') % cycleLength;

    if (cycleDay < periodLength) return PHASES.menstrual;
    if (cycleDay < cycleLength * 0.3) return PHASES.follicular;
    if (cycleDay < cycleLength * 0.5) return PHASES.ovulation;
    return PHASES.luteal;
  };

  const calculatePeriodStatus = () => {
    const today = moment();
    const currentPhase = getCurrentPhase(today);
    const lastPeriodStart = moment(userData.lastPeriodStart);

    if (isInPeriod()) {
      const currentDay = today.diff(lastPeriodStart, 'days') + 1;
      return {
        daysCount: currentDay,
        message: `Day ${currentDay} of period`,
        phase: currentPhase,
      };
    }

    let nextPeriodDate = moment(lastPeriodStart);
    while (nextPeriodDate.isSameOrBefore(today)) {
      nextPeriodDate.add(cycleLength, 'days');
    }

    const daysToNext = nextPeriodDate.diff(today, 'days');
    return {
      daysCount: daysToNext,
      message: `Days until next period`,
      phase: getCurrentPhase(today),
    };
  };

  const renderDates = () => {
    const daysInMonth = selectedMonth.daysInMonth();
    const startDate = moment(selectedMonth).startOf('month');
    const dates = [];

    const startOfSelectedMonth = moment(selectedMonth).startOf('month');
    const endOfSelectedMonth = moment(selectedMonth).endOf('month');

    // Calculate all relevant periods for the selected month
    const periods = [];
    let currentPeriodStart = moment(userData.lastPeriodStart);

    // Adjust to find the first period that could affect the selected month
    while (currentPeriodStart.isAfter(startOfSelectedMonth)) {
      currentPeriodStart.subtract(cycleLength, 'days');
    }

    // Generate all periods overlapping with the selected month
    while (currentPeriodStart.isBefore(endOfSelectedMonth)) {
      const periodEnd = moment(currentPeriodStart).add(periodLength - 1, 'days');
      periods.push({
        start: moment(currentPeriodStart),
        end: periodEnd,
      });
      currentPeriodStart.add(cycleLength, 'days');
    }

    for (let i = 0; i < daysInMonth; i++) {
      const date = moment(startDate).add(i, 'days');
      const angle = (i / daysInMonth) * 2 * Math.PI;
      const radius = CIRCLE_SIZE / 2 - 30;
      const x = Math.cos(angle) * radius + CIRCLE_SIZE / 2;
      const y = Math.sin(angle) * radius + CIRCLE_SIZE / 2;

      // Check if date falls within any period
      const isPeriodDate = periods.some(period =>
        date.isBetween(period.start, period.end, null, '[]')
      );

      dates.push(
        <G key={i}>
          {isPeriodDate && (
            <Circle
              cx={x}
              cy={y + 1}
              r="12"
              fill="rgba(169, 110, 91, 0.2)"
              stroke={COLORS.primary}
              strokeWidth="1"
            />
          )}
          <SvgText
            x={x}
            y={y + 5}
            fill={isPeriodDate ? COLORS.primary : COLORS.lightText}
            fontSize="12"
            textAnchor="middle"
            fontWeight={isPeriodDate ? 'bold' : 'normal'}
          >
            {date.format('D')}
          </SvgText>
        </G>
      );
    }
    return dates;
  };

  const periodStatus = calculatePeriodStatus();

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.monthTabsContainer}>
        <TouchableOpacity onPress={() => setSelectedMonth(moment(selectedMonth).subtract(1, 'month'))}>
          <MaterialIcons name="chevron-left" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{selectedMonth.format('MMMM YYYY')}</Text>
        <TouchableOpacity onPress={() => setSelectedMonth(moment(selectedMonth).add(1, 'month'))}>
          <MaterialIcons name="chevron-right" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Circular Date Display */}
      <View style={styles.circleContainer}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          {renderDates()}
        </Svg>
        <View style={styles.centerTextContainer}>
          <Text style={styles.centerTextNumber}>{periodStatus.daysCount}</Text>
          <Text style={styles.centerTextMessage}>{periodStatus.message}</Text>
          <Text style={[styles.phaseText, { color: periodStatus.phase.color }]}>
            {periodStatus.phase.name}
          </Text>
        </View>
      </View>

      {/* Recommended Reads */}
      <RecommendedReads phases={PHASES} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 15,
  },
  monthTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  monthText: {
    fontSize: 20,
    color: COLORS.text,
    marginHorizontal: 15,
    fontWeight: '600',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },
  centerTextMessage: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 4,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default PeriodTracker;