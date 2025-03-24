import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useUser } from './context/UserContext';
import { db } from '../firebase.config';
import { collection, doc, setDoc, query, where, getDocs, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Import Component
import MonthSelector from '../Component/MonthSelector';
import CycleCalendar from '../Component/CycleCalendar';
import StatusCard from '../Component/StatusCard';
import SymptomDrawer from '../Component/SymptomDrawer';
import CalendarLegend from '../Component/CalendarLegend ';
// Import utils and constants
import { COLORS } from './colors';
import { generateCalendarData, getCurrentPhase, calculatePeriodStatus } from '../Component/CycleCalculations';

const CycleHealthTracking = () => {
  const { userData, isInPeriod, updateUserData } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [symptomLogs, setSymptomLogs] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch symptom logs from Firestore
  useEffect(() => {
    const fetchSymptomLogs = async () => {
      if (!userData?.uid || !userData?.isLoggedIn) {
        setLoading(false);
        return;
      }
      
      try {
        const userLogsRef = doc(db, 'userCycleLogs', userData.uid);
        const userLogsDoc = await getDoc(userLogsRef);
        
        if (userLogsDoc.exists()) {
          const data = userLogsDoc.data();
          setSymptomLogs(data.logs || {});
        } else {
          setSymptomLogs({});
        }
      } catch (error) {
        console.error('Error fetching symptom logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptomLogs();
  }, [userData?.uid, userData?.isLoggedIn]);

  // Symptom logging state
  const [menstrualFlow, setMenstrualFlow] = useState('');
  const [moods, setMoods] = useState({
    happy: false,
    content: false,
    irritated: false,
    calm: false,
    sad: false,
    unhappy: false
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
          happy: false,
          content: false,
          irritated: false,
          calm: false,
          sad: false,
          unhappy: false
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
          happy: false,
          content: false,
          irritated: false,
          calm: false,
          sad: false,
          unhappy: false
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

  const saveSymptomLog = async () => {
    if (!userData?.uid || !userData?.isLoggedIn) {
      console.log('Cannot save log: No user data or not logged in');
      return;
    }
    
    const dateKey = selectedDate.format('YYYY-MM-DD');
    
    // Create arrays of selected moods and symptoms with emojis
    const selectedMoodsArray = Object.keys(moods)
      .filter(key => moods[key])
      .map(key => {
        const emojiMap = {
          happy: '😊',
          content: '😌',
          irritated: '😟',
          calm: '😌',
          sad: '😔',
          unhappy: '😟',
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

    try {
      // Save to Firestore using update to modify only the specific date in the logs object
      const userLogsRef = doc(db, 'userCycleLogs', userData.uid);
      await setDoc(userLogsRef, {
        logs: {
          [dateKey]: log
        }
      }, { merge: true });
      
      // Update local state
      setSymptomLogs(prevLogs => ({
        ...prevLogs,
        [dateKey]: log,
      }));
    } catch (error) {
      console.error('Error saving symptom log:', error);
    }
    
    setDrawerVisible(false);
  };

  const calendarData = generateCalendarData(selectedMonth, userData, symptomLogs, selectedDate);
  const periodStatus = calculatePeriodStatus(userData, cycleLength, periodLength, isInPeriod);
  const currentPhase = getCurrentPhase(selectedDate, userData);
  const isPeriodDay = currentPhase.name === 'Menstrual Phase';

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your cycle data...</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerSection}>
              <MonthSelector 
                selectedMonth={selectedMonth} 
                onPrevMonth={() => setSelectedMonth(moment(selectedMonth).subtract(1, 'month'))}
                onNextMonth={() => setSelectedMonth(moment(selectedMonth).add(1, 'month'))}
              />
              
              <CycleCalendar 
                calendarData={calendarData}
                onDayPress={handleDayPress}
              />

              <View style={styles.legendContainer}>
                <CalendarLegend />
              </View>
            </View>
              
            <View style={styles.contentSection}>
              <View style={styles.bottomSpacing} />
            </View>
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    backgroundColor: COLORS.white,
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 12,
  },
  legendContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  horizontalContainer: {
    marginVertical: 10,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
  }
});

export default CycleHealthTracking;