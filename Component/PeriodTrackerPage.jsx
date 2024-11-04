import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useUser } from './context/UserContext';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;
const CENTER_CIRCLE_SIZE = CIRCLE_SIZE * 0.6;

const PeriodTracker = () => {
  const { 
    userData, 
    getNextPeriodDate, 
    getFertilityWindow, 
    isInPeriod 
  } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [tipsModalVisible, setTipsModalVisible] = useState(false);

  const cycleLength = parseInt(userData.cycleDays) || 28;
  const periodLength = parseInt(userData.periodDays) || 5;
  
  // Calculate active dates for the selected month
  const calculateActiveDates = (month) => {
    const activeDates = [];
    const lastPeriodStart = moment(userData.lastPeriodStart);
    let currentCycleStart = moment(lastPeriodStart);
    
    // Go back a few cycles to ensure we catch dates in the selected month
    currentCycleStart.subtract(2, 'months');
    
    // Calculate for next 6 months to ensure coverage
    while (currentCycleStart.isBefore(moment().add(6, 'months'))) {
      if (currentCycleStart.isSame(month, 'month')) {
        // Add period dates
        for (let i = 0; i < periodLength; i++) {
          const periodDate = moment(currentCycleStart).add(i, 'days');
          if (periodDate.isSame(month, 'month')) {
            activeDates.push({
              day: periodDate.date(),
              type: 'period'
            });
          }
        }
        
        // Calculate fertility window
        const nextPeriodStart = moment(currentCycleStart).add(cycleLength, 'days');
        const fertileStart = moment(nextPeriodStart).subtract(16, 'days');
        const fertileEnd = moment(nextPeriodStart).subtract(12, 'days');
        
        // Add fertility window dates
        if (fertileStart.isSame(month, 'month') || fertileEnd.isSame(month, 'month')) {
          for (let date = moment(fertileStart); date.isSameOrBefore(fertileEnd); date.add(1, 'day')) {
            if (date.isSame(month, 'month')) {
              activeDates.push({
                day: date.date(),
                type: 'fertile'
              });
            }
          }
        }
      }
      currentCycleStart.add(cycleLength, 'days');
    }
    
    return activeDates;
  };

  const calculatePeriodStatus = () => {
    const today = moment();
    const lastPeriodStart = moment(userData.lastPeriodStart);
    
    if (isInPeriod()) {
      const currentDay = today.diff(lastPeriodStart, 'days') + 1;
      return {
        isOnPeriod: true,
        message: `Period day ${currentDay}`,
        daysCount: currentDay
      };
    }
    
    let nextPeriodDate = moment(lastPeriodStart);
    while (nextPeriodDate.isSameOrBefore(today)) {
      nextPeriodDate.add(cycleLength, 'days');
    }
    
    const daysToNext = nextPeriodDate.diff(today, 'days');
    return {
      isOnPeriod: false,
      message: `days until\nnext period`,
      daysCount: daysToNext
    };
  };

  // Generate positions for dates in a circle
  const generateDatePositions = () => {
    const positions = [];
    const totalDays = selectedMonth.daysInMonth();
    const radius = (CIRCLE_SIZE - 40) / 2;
    
    for (let i = 1; i <= totalDays; i++) {
      const angle = ((i - 1) * 2 * Math.PI) / totalDays - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      const activeDate = activeDates.find(d => d.day === i);
      positions.push({ 
        day: i, 
        x, 
        y, 
        type: activeDate?.type || 'normal',
        isToday: moment().date() === i && moment().isSame(selectedMonth, 'month')
      });
    }
    return positions;
  };

  const getDateColor = (type, isToday) => {
    if (isToday) return '#FF8FAB';
    switch (type) {
      case 'period':
        return '#FF69B4';
      case 'fertile':
        return '#90EE90';
      default:
        return '#FFE5EC';
    }
  };
  const wellnessTips = [
    'Stay hydrated',
    'Get regular exercise',
    'Practice stress management',
    'Maintain a balanced diet',
    'Get adequate sleep',
    'Use a heating pad for cramps',
    'Try gentle yoga or stretching'
  ];

  const activeDates = calculateActiveDates(selectedMonth);
  const datePositions = generateDatePositions();
  const periodStatus = calculatePeriodStatus();
  const getCurrentPhase = () => {
    const today = moment();
    const lastPeriodStart = moment(userData.lastPeriodStart);
    const daysSinceLastPeriod = today.diff(lastPeriodStart, 'days');
    
    if (isInPeriod()) {
      return { phase: 'Menstrual', color: '#FF69B4' };
    } else if (daysSinceLastPeriod < 7) {
      return { phase: 'Follicular', color: '#FFB347' };
    } else if (daysSinceLastPeriod < 14) {
      return { phase: 'Ovulatory', color: '#98FB98' };
    } else {
      return { phase: 'Luteal', color: '#DDA0DD' };
    }
  };

  const getPhaseInfo = (phase) => {
    switch (phase) {
      case 'Menstrual':
        return "This is when your period occurs. Focus on self-care and rest.";
      case 'Follicular':
        return "Your body is preparing for ovulation. Energy levels start to rise.";
      case 'Ovulatory':
        return "Ovulation occurs. You may feel more energetic and confident.";
      case 'Luteal':
        return "Your body prepares for either pregnancy or menstruation. You might experience PMS symptoms.";
      default:
        return "";
    }
  };
  const currentPhase = getCurrentPhase();
  const [modalVisible, setModalVisible] = useState(false);
  const renderMonthTabs = () => (
    <View style={styles.monthTabsContainer}>
      <TouchableOpacity
        onPress={() => setSelectedMonth(moment(selectedMonth).subtract(1, 'month'))}
        style={styles.arrowButton}
      >
        <MaterialIcons name="chevron-left" size={30} color="#FF8FAB" />
      </TouchableOpacity>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthTabs}
      >
        <View style={[styles.monthTab, styles.activeMonthTab]}>
          <Text style={[styles.monthText, styles.activeMonthText]}>
            {selectedMonth.format('MMMM YYYY')}
          </Text>
        </View>
      </ScrollView>
      
      <TouchableOpacity
        onPress={() => setSelectedMonth(moment(selectedMonth).add(1, 'month'))}
        style={styles.arrowButton}
      >
        <MaterialIcons name="chevron-right" size={30} color="#FF8FAB" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Track Your Flow</Text>
      {renderMonthTabs()}
      
      <View style={styles.circleContainer}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          {/* Outer circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={(CIRCLE_SIZE - 40) / 2}
            stroke="#FFE5EC"
            strokeWidth="30"
            fill="transparent"
          />
          
          {/* Date dots - removed onPress handler */}
          {datePositions.map(({ day, x, y, type, isToday }) => (
            <G
              key={day}
              x={CIRCLE_SIZE / 2 + x}
              y={CIRCLE_SIZE / 2 + y}
            >
              <Circle
                cx={0}
                cy={0}
                r={12}
                fill={getDateColor(type, isToday)}
              />
              <SvgText
                x={0}
                y={5}
                fill="#555"
                fontSize="12"
                textAnchor="middle"
              >
                {day}
              </SvgText>
            </G>
          ))}
          
          {/* Center circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={CENTER_CIRCLE_SIZE / 2}
            fill="#FF8FAB"
          />
          
          {/* Center text */}
          <SvgText
            x={CIRCLE_SIZE / 2}
            y={CIRCLE_SIZE / 2 - 20}
            fill="white"
            fontSize="34"
            textAnchor="middle"
          >
            {periodStatus.daysCount}
          </SvgText>
          <SvgText
            x={CIRCLE_SIZE / 2}
            y={CIRCLE_SIZE / 2 + 10}
            fill="white"
            fontSize="16"
            textAnchor="middle"
          >
            {periodStatus.message}
          </SvgText>
        </Svg>
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF69B4' }]} />
          <Text style={styles.legendText}>Period Days</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#90EE90' }]} />
          <Text style={styles.legendText}>Fertility Window</Text>
        </View>
      </View>
      <View style = {styles.rowcont}>
      <TouchableOpacity
        style={[styles.phaseContainer, { backgroundColor: currentPhase.color }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.phaseText}>{currentPhase.phase} Phase</Text>
        <Text style={styles.phasecontdesc}>Learn More</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}v
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentPhase.phase} Phase</Text>
            <Text style={styles.modalText}>{getPhaseInfo(currentPhase.phase)}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
     
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  rowcont: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 30,
      flexWrap: 'wrap',
    },
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    paddingTop: 60,
  },
  phasecontdesc: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8FAB',
    textAlign: 'center',
    marginBottom: 20,
  },
  monthTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  monthTabs: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  monthTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeMonthTab: {
    backgroundColor: '#FFE5EC',
  },
  monthText: {
    fontSize: 16,
    color: '#666',
  },
  activeMonthText: {
    color: '#FF8FAB',
    fontWeight: 'bold',
  },
  arrowButton: {
    padding: 10,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  phaseContainer: {
    height:150,
    width: 150,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF8FAB',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  closeButton: {
    backgroundColor: '#FF8FAB',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    height: 150,
    width: 150,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  infoDescription: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  scrollContainer: {
    maxHeight: 300,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5EC',
  },
  symptomText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F4F8',
  },
  tipText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#FF8FAB',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default PeriodTracker;