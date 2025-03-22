import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useUser } from './context/UserContext';

// Import Component
import MonthSelector from '../Component/MonthSelector';
import CycleCalendar from '../Component/CycleCalendar';
import StatusCard from '../Component/StatusCard';
import AIInsightsContainer from '../Component/AIInsightsContainer';
import SymptomDrawer from '../Component/SymptomDrawer';
import CalendarLegend from '../Component/CalendarLegend ';
import PeriodGapChart from '../Component/PeriodGapChart';
// Import utils and constants
import { COLORS } from './colors';
import { generateCalendarData, getCurrentPhase, calculatePeriodStatus } from '../Component/CycleCalculations';

const CycleHealthTracking = () => {
  const { userData, isInPeriod } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // Test data for period cycles (last 6 months)
  const testPeriodData = {
    cycles: [
      {
        startDate: moment().subtract(5, 'months').date(8).format('YYYY-MM-DD'),
        endDate: moment().subtract(5, 'months').date(13).format('YYYY-MM-DD'),
        length: 29, // cycle length
        periodLength: 5
      },
      {
        startDate: moment().subtract(4, 'months').date(7).format('YYYY-MM-DD'),
        endDate: moment().subtract(4, 'months').date(11).format('YYYY-MM-DD'),
        length: 31, // slightly longer cycle
        periodLength: 4
      },
      {
        startDate: moment().subtract(3, 'months').date(9).format('YYYY-MM-DD'),
        endDate: moment().subtract(3, 'months').date(14).format('YYYY-MM-DD'),
        length: 26, // shorter cycle
        periodLength: 5
      },
      {
        startDate: moment().subtract(2, 'months').date(5).format('YYYY-MM-DD'),
        endDate: moment().subtract(2, 'months').date(10).format('YYYY-MM-DD'),
        length: 28, // normal cycle
        periodLength: 5
      },
      {
        startDate: moment().subtract(1, 'months').date(3).format('YYYY-MM-DD'),
        endDate: moment().subtract(1, 'months').date(9).format('YYYY-MM-DD'),
        length: 30, // slightly longer cycle
        periodLength: 6
      },
      {
        startDate: moment().date(2).format('YYYY-MM-DD'),
        endDate: moment().date(6).format('YYYY-MM-DD'),
        length: 27, // current cycle
        periodLength: 4
      }
    ]
  };

  // Initialize with test data spanning different months
  const [symptomLogs, setSymptomLogs] = useState({
    // Current month entries
    [moment().format('YYYY-MM-DD')]: {
      menstrualFlow: { value: 'medium', emoji: '🩸', text: 'Medium' },
      moods: [{ id: 'calm', emoji: '😌', text: 'Calm' }],
      symptoms: [{ id: 'cramps', emoji: '😖', text: 'Cramps' }],
      phase: 'Menstrual Phase',
      loggedAt: moment().format(),
    },
    // Previous month entries with aligned period dates from testPeriodData
    [moment().subtract(1, 'month').date(3).format('YYYY-MM-DD')]: {
      menstrualFlow: { value: 'heavy', emoji: '🔴', text: 'Heavy' },
      moods: [{ id: 'happy', emoji: '😊', text: 'Happy' }],
      symptoms: [{ id: 'fine', emoji: '🙂', text: 'Everything is fine' }],
      phase: 'Menstrual Phase',
      loggedAt: moment().subtract(1, 'month').format(),
    },
    // Two months ago entries with aligned period dates
    [moment().subtract(2, 'months').date(5).format('YYYY-MM-DD')]: {
      menstrualFlow: { value: 'heavy', emoji: '🔴', text: 'Heavy' },
      moods: [{ id: 'anxious', emoji: '😟', text: 'Anxious' }],
      symptoms: [{ id: 'headache', emoji: '🤕', text: 'Headache' }],
      phase: 'Menstrual Phase',
      loggedAt: moment().subtract(2, 'months').format(),
    },
    // Three months ago
    [moment().subtract(3, 'months').date(9).format('YYYY-MM-DD')]: {
      menstrualFlow: { value: 'light', emoji: '💧', text: 'Light' },
      moods: [{ id: 'sleepy', emoji: '😴', text: 'Sleepy' }],
      symptoms: [{ id: 'cramps', emoji: '😖', text: 'Cramps' }],
      phase: 'Menstrual Phase',
      loggedAt: moment().subtract(3, 'months').format(),
    },
    // Four months ago
    [moment().subtract(4, 'months').date(7).format('YYYY-MM-DD')]: {
      menstrualFlow: { value: 'medium', emoji: '🩸', text: 'Medium' },
      moods: [{ id: 'sad', emoji: '😔', text: 'Sad' }],
      symptoms: [{ id: 'headache', emoji: '🤕', text: 'Headache' }],
      phase: 'Menstrual Phase',
      loggedAt: moment().subtract(4, 'months').format(),
    },
    // Five months ago
    [moment().subtract(5, 'months').date(8).format('YYYY-MM-DD')]: {
      menstrualFlow: { value: 'medium', emoji: '🩸', text: 'Medium' },
      moods: [{ id: 'calm', emoji: '😌', text: 'Calm' }],
      symptoms: [{ id: 'fine', emoji: '🙂', text: 'Everything is fine' }],
      phase: 'Menstrual Phase',
      loggedAt: moment().subtract(5, 'months').format(),
    },
    // Next month predicted period
    [moment().add(1, 'month').date(1).format('YYYY-MM-DD')]: {
      menstrualFlow: { value: 'light', emoji: '💧', text: 'Light' },
      moods: [],
      symptoms: [],
      phase: 'Menstrual Phase',
      loggedAt: moment().format(),
    },
  });

  // Symptom logging state
  const [menstrualFlow, setMenstrualFlow] = useState('');
  const [moods, setMoods] = useState({
    calm: false,
    happy: false,
    anxious: false,
    distracted: false, 
    confused: false,
    angry: false,
    sad: false,
    sleepy: false
  });
  const [symptoms, setSymptoms] = useState({
    fine: false,
    nausea: false,
    constipation: false,
    cramps: false,
    cravings: false,
    oilySkin: false,
    hairChanges: false,
    acne: false,
    headache: false
  });

  const cycleLength = parseInt(userData?.cycleDays) || 28;
  const periodLength = parseInt(userData?.periodDays) || 5;

  const handleDayPress = (day) => {
    setSelectedDate(day.date);
    
    // Only allow symptom logging for past or today's dates
    if (!day.isFuture) {
      // Load existing logs if any
      const dateKey = day.date.format('YYYY-MM-DD');
      if (symptomLogs[dateKey]) {
        const log = symptomLogs[dateKey];
        setMenstrualFlow(log.menstrualFlow?.value || '');
        setMoods(log.moods?.reduce((acc, mood) => {
          acc[mood.id] = true;
          return acc;
        }, {
          calm: false,
          happy: false,
          anxious: false,
          distracted: false, 
          confused: false,
          angry: false,
          sad: false,
          sleepy: false
        }) || {});
        setSymptoms(log.symptoms?.reduce((acc, symptom) => {
          acc[symptom.id] = true;
          return acc;
        }, {
          fine: false,
          nausea: false,
          constipation: false,
          cramps: false,
          cravings: false,
          oilySkin: false,
          hairChanges: false,
          acne: false,
          headache: false
        }) || {});
      } else {
        // Reset form if no existing logs
        setMenstrualFlow('');
        setMoods({
          calm: false,
          happy: false,
          anxious: false,
          distracted: false, 
          confused: false,
          angry: false,
          sad: false,
          sleepy: false
        });
        setSymptoms({
          fine: false,
          nausea: false,
          constipation: false,
          cramps: false,
          cravings: false,
          oilySkin: false,
          hairChanges: false,
          acne: false,
          headache: false
        });
      }
      
      setDrawerVisible(true);
    }
  };

  const saveSymptomLog = () => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    
    // Create arrays of selected moods and symptoms with emojis
    const selectedMoodsArray = Object.keys(moods)
      .filter(key => moods[key])
      .map(key => {
        const emojiMap = {
          calm: '😌',
          happy: '😊',
          anxious: '😟',
          distracted: '😳',
          confused: '🤔',
          angry: '😠',
          sad: '😔',
          sleepy: '😴',
        };
        
        return {
          id: key,
          emoji: emojiMap[key],
          text: key.charAt(0).toUpperCase() + key.slice(1)
        };
      });
    
    const selectedSymptomsArray = Object.keys(symptoms)
      .filter(key => symptoms[key])
      .map(key => {
        const emojiMap = {
          fine: '🙂',
          nausea: '🤢',
          constipation: '😣',
          cramps: '😖',
          cravings: '🍫',
          oilySkin: '💦',
          hairChanges: '💇‍♀️',
          acne: '😬',
          headache: '🤕',
        };
        
        return {
          id: key,
          emoji: emojiMap[key],
          text: key === 'fine' ? 'Everything is fine' : key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
        };
      });
      
    const flowData = menstrualFlow ? {
      value: menstrualFlow,
      emoji: menstrualFlow === 'light' ? '💧' : menstrualFlow === 'medium' ? '🩸' : '🔴',
      text: menstrualFlow.charAt(0).toUpperCase() + menstrualFlow.slice(1)
    } : null;
    
    const log = {
      date: dateKey,
      menstrualFlow: flowData,
      moods: selectedMoodsArray,
      symptoms: selectedSymptomsArray,
      phase: getCurrentPhase(selectedDate, userData).name,
      loggedAt: moment().format(),
    };
    
    setSymptomLogs({
      ...symptomLogs,
      [dateKey]: log,
    });
    
    setDrawerVisible(false);
  };

  const getAIGeneratedInsights = () => {
    const phase = getCurrentPhase(selectedDate, userData);
    
    // Customize insights based on the phase
    const phaseInsights = {
      'Menstrual Phase': [
        "Take it easy and rest when needed",
        "Stay hydrated and warm",
        "Light exercise like walking or yoga"
      ],
      'Follicular Phase': [
        "Energy levels are rising",
        "Great time for new projects",
        "Focus on strength training"
      ],
      'Ovulation Phase': [
        "Peak energy and confidence",
        "Ideal for social activities",
        "Perfect for high-intensity workouts"
      ],
      'Luteal Phase': [
        "Practice self-care routines",
        "Maintain balanced nutrition",
        "Listen to your body's needs"
      ]
    };

    return phaseInsights[phase.name] || [
      "Track your symptoms daily",
      "Stay consistent with routines",
      "Monitor your cycle patterns"
    ];
  };

  const calendarData = generateCalendarData(selectedMonth, userData, symptomLogs, selectedDate);
  const periodStatus = calculatePeriodStatus(userData, cycleLength, periodLength, isInPeriod);
  const insights = getAIGeneratedInsights();
  const currentPhase = getCurrentPhase(selectedDate, userData);
  const isPeriodDay = currentPhase.name === 'Menstrual Phase';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <MonthSelector 
          selectedMonth={selectedMonth} 
          onPrevMonth={() => setSelectedMonth(moment(selectedMonth).subtract(1, 'month'))}
          onNextMonth={() => setSelectedMonth(moment(selectedMonth).add(1, 'month'))}
        />
        
        <CycleCalendar 
          calendarData={calendarData}
          onDayPress={handleDayPress}
        />

        {/* Calendar Legend as thin container below calendar */}
        <View style={styles.legendContainer}>
          <CalendarLegend />
        </View>

        {/* Horizontal container for Period Gap Chart */}
        <View style={styles.horizontalContainer}>
          <PeriodGapChart userData={userData} />
        </View>

        <AIInsightsContainer 
          insights={insights}
          phase={currentPhase}
        />
      </ScrollView>
      
      <SymptomDrawer 
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        isPeriodDay={isPeriodDay}
        menstrualFlow={menstrualFlow}
        setMenstrualFlow={setMenstrualFlow}
        moods={moods}
        setMoods={setMoods}
        symptoms={symptoms}
        setSymptoms={setSymptoms}
        onSave={saveSymptomLog}
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => handleDayPress({ date: moment(), isFuture: false })}
      >
        <MaterialIcons name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  legendContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  horizontalContainer: {
    marginVertical: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  }
});

export default CycleHealthTracking;