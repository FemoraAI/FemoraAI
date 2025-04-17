import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, { G, Text as SvgText, Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';

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
  warning: '#FF4D6D',
};

const CircularPeriodTracker = ({ 
  selectedMonth, 
  setSelectedMonth, 
  userData, 
  periodStatus,
  cycleLength,
  periodLength 
}) => {
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

      const isPeriodDate = periods.some(period =>
        date.isBetween(period.start, period.end, null, '[]')
      );

      dates.push(
        <G key={i}>
          <Circle
            cx={x}
            cy={y + 1}
            r="12"
            fill={isPeriodDate ? COLORS.primary : 'transparent'}
            stroke={isPeriodDate ? 'transparent' : 'transparent'}
            strokeWidth="1"
          />
          <SvgText
            x={x}
            y={y + 5}
            fill={isPeriodDate ? COLORS.white : COLORS.lightText}
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

  const renderCenterContent = () => {
    if (userData.isLatePeriod) {
      return (
        <>
          <Text style={styles.latePeriodText}>
            Periods {userData.daysLate} {userData.daysLate === 1 ? 'day' : 'days'} late
          </Text>
        </>
      );
    }

    return (
      <>
        <Text style={styles.centerTextNumber}>{periodStatus.daysCount}</Text>
        <Text style={styles.centerTextMessage}>{periodStatus.message}</Text>
        <Text style={[styles.phaseText, { color: periodStatus.phase.color }]}>
          {periodStatus.phase.name}
        </Text>
      </>
    );
  };

  return (
    <>
      <View style={styles.monthTabsContainer}>
        <TouchableOpacity 
          onPress={() => setSelectedMonth(moment(selectedMonth).subtract(1, 'month'))}
          style={styles.arrowButton}
        >
          <MaterialIcons name="chevron-left" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{selectedMonth.format('MMMM YYYY')}</Text>
        <TouchableOpacity 
          onPress={() => setSelectedMonth(moment(selectedMonth).add(1, 'month'))}
          style={styles.arrowButton}
        >
          <MaterialIcons name="chevron-right" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.circleContainer}>
        <View style={styles.waveContainer}>
          <LottieView
            source={require('../assets/animations/waves.json')}
            autoPlay
            loop
            style={styles.waveAnimation}
          />
        </View>
        
        <View style={styles.outerCircleShadow}>
          <LinearGradient
            colors={userData.isLatePeriod ? ['#FFF5F5', '#FFE5E5'] : ['#FFF5F7', '#FFE5E5']}
            style={styles.gradientCircle}
          >
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.circularTracker}>
              {renderDates()}
            </Svg>
            
            <View style={[
              styles.centerTextContainer,
              userData.isLatePeriod && styles.centerTextContainerLate
            ]}>
              {renderCenterContent()}
            </View>
          </LinearGradient>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  monthTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  arrowButton: {
    padding: 15,
    marginHorizontal: -5,
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
    position: 'relative',
  },
  outerCircleShadow: {
    borderRadius: CIRCLE_SIZE / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  gradientCircle: {
    width: '100%',
    height: '100%',
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  waveAnimation: {
    width: CIRCLE_SIZE * 1.2,
    height: CIRCLE_SIZE * 1.2,
  },
  circularTracker: {
    position: 'absolute',
    zIndex: 1,
  },
  centerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: CIRCLE_SIZE * 0.4,
    height: CIRCLE_SIZE * 0.4,
    zIndex: 2,
  },
  centerTextContainerLate: {
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
    borderRadius: (CIRCLE_SIZE * 0.4) / 2,
    padding: 10,
  },
  centerTextNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  centerTextMessage: {
    fontSize: 16,
    color: COLORS.lightText,
    marginTop: 4,
    textAlign: 'center',
  },
  latePeriodText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.warning,
    textAlign: 'center',
    fontFamily: 'Montserrat Alternates Regular',
    lineHeight: 24,
  },
  phaseText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  warningIcon: {
    marginBottom: 5,
  },
});

export default CircularPeriodTracker; 