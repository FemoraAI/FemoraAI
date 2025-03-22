import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import { useUser } from './context/UserContext';
import RecommendedReads from '../Component/RecommendedReads';
import MoodLogger from './SymptomMoodLogger';
import CircularPeriodTracker from './CircularPeriodTracker';

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

  const periodStatus = calculatePeriodStatus();

  return (
    <View style={styles.container}>
      <CircularPeriodTracker
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        userData={userData}
        periodStatus={periodStatus}
        cycleLength={cycleLength}
        periodLength={periodLength}
      />
      <MoodLogger />
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
});

export default PeriodTracker;