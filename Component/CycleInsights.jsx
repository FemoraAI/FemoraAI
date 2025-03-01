import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import {
  MenstrualFlowSelector,
  MoodSelector,
  SymptomSelector
} from '../Component/modal/EmojiComponents';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { useUser } from './context/UserContext';
import CalendarLegend from './modal/CalendarLegend';

// Earth tone color scheme (keeping from your original code)
const COLORS = {
  background: '#FFF5F7', // Light pink background from the image
  primary: '#F06292', // Bright pink from image
  secondary: '#7A9E7E',
  accent: '#D4A373',
  text: '#333333',
  lightText: '#777777',
  white: '#FFFFFF',
  lightPink: '#FFCDD2', // Light pink for period days
  mediumPink: '#F48FB1', // Medium pink for selected date
  purpleLight: '#E1BEE7', // Light purple for ovulation
  peach: '#FFCCBC', // Peach color for fertile days
};

const PHASES = {
  menstrual: { name: 'Menstrual Phase', color: COLORS.primary },
  follicular: { name: 'Follicular Phase', color: COLORS.secondary },
  ovulation: { name: 'Ovulation Phase', color: COLORS.accent },
  luteal: { name: 'Luteal Phase', color: COLORS.lightText },
};

const CycleHealthTracking = () => {
  const { userData, isInPeriod } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [symptomLogs, setSymptomLogs] = useState({});

  // Symptom logging state
  const [stress, setStress] = useState(0);
  const [discharge, setDischarge] = useState('');
  const [periodBloodColor, setPeriodBloodColor] = useState('');
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

  const getCurrentPhase = (date) => {
    if (!userData?.lastPeriodStart) return PHASES.follicular;
    
    const cycleDay = date.diff(moment(userData.lastPeriodStart), 'days') % cycleLength;

    if (cycleDay < periodLength) return PHASES.menstrual;
    if (cycleDay < cycleLength * 0.3) return PHASES.follicular;
    if (cycleDay < cycleLength * 0.5) return PHASES.ovulation;
    return PHASES.luteal;
  };

  const calculatePeriodStatus = () => {
    if (!userData?.lastPeriodStart) {
      return {
        daysCount: 0,
        message: "Set your last period date",
        phase: PHASES.follicular,
      };
    }

    const today = moment();
    const currentPhase = getCurrentPhase(today);
    const lastPeriodStart = moment(userData.lastPeriodStart);

    if (isInPeriod()) {
      const currentDay = today.diff(lastPeriodStart, 'days') % cycleLength + 1;
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

  // Generate calendar data
  const generateCalendarData = () => {
    const firstDayOfMonth = moment(selectedMonth).startOf('month');
    const lastDayOfMonth = moment(selectedMonth).endOf('month');
    const startOfCalendar = moment(firstDayOfMonth).startOf('week');
    const endOfCalendar = moment(lastDayOfMonth).endOf('week');
    
    const days = [];
    const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    
    // Add week days header
    days.push(weekDays);
    
    // Calculate all days that should be in period
    const periodDays = [];
    if (userData?.lastPeriodStart) {
      let periodStart = moment(userData.lastPeriodStart);
      
      // Find the first period that could be visible in the calendar
      while (periodStart.isAfter(startOfCalendar)) {
        periodStart.subtract(cycleLength, 'days');
      }
      
      // Generate all periods visible in the calendar
      while (periodStart.isBefore(endOfCalendar)) {
        for (let i = 0; i < periodLength; i++) {
          const periodDate = moment(periodStart).add(i, 'days');
          periodDays.push(periodDate.format('YYYY-MM-DD'));
        }
        periodStart.add(cycleLength, 'days');
      }
    }
    
    // Calculate ovulation days (typically around day 14 of a cycle)
    const ovulationDays = [];
    if (userData?.lastPeriodStart) {
      let ovulationDay = moment(userData.lastPeriodStart).add(Math.floor(cycleLength / 2) - 1, 'days');
      
      while (ovulationDay.isAfter(startOfCalendar)) {
        ovulationDay.subtract(cycleLength, 'days');
      }
      
      while (ovulationDay.isBefore(endOfCalendar)) {
        ovulationDays.push(ovulationDay.format('YYYY-MM-DD'));
        // Add days around ovulation for fertile window
        for (let i = -2; i <= 2; i++) {
          if (i !== 0) {
            const fertileDay = moment(ovulationDay).add(i, 'days');
            ovulationDays.push(fertileDay.format('YYYY-MM-DD'));
          }
        }
        ovulationDay.add(cycleLength, 'days');
      }
    }
    
    // Generate calendar weeks
    let currentDate = moment(startOfCalendar);
    while (currentDate.isBefore(endOfCalendar)) {
      const week = [];
      
      for (let i = 0; i < 7; i++) {
        const day = {
          date: moment(currentDate),
          text: currentDate.date(),
          inMonth: currentDate.month() === selectedMonth.month(),
          isToday: currentDate.isSame(moment(), 'day'),
          isSelected: currentDate.isSame(selectedDate, 'day'),
          isPeriod: periodDays.includes(currentDate.format('YYYY-MM-DD')),
          isOvulation: ovulationDays.includes(currentDate.format('YYYY-MM-DD')),
          hasLog: symptomLogs[currentDate.format('YYYY-MM-DD')],
          isFuture: currentDate.isAfter(moment(), 'day'),
        };
        
        week.push(day);
        currentDate.add(1, 'day');
      }
      
      days.push(week);
    }
    
    return days;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.date);
    
    // Only allow symptom logging for past or today's dates
    if (!day.isFuture) {
      // Load existing logs if any
      const dateKey = day.date.format('YYYY-MM-DD');
      if (symptomLogs[dateKey]) {
        const log = symptomLogs[dateKey];
        setStress(log.stress || 0);
        setDischarge(log.discharge || '');
        setPeriodBloodColor(log.periodBloodColor || '');
        setSymptoms(log.symptoms || {
          cramps: false,
          bloating: false,
          nausea: false,
          headache: false,
          fatigue: false,
          moodSwings: false,
          breastTenderness: false,
          acne: false,
        });
      } else {
        // Reset form if no existing logs
        setStress(0);
        setDischarge('');
        setPeriodBloodColor('');
        setSymptoms({
          cramps: false,
          bloating: false,
          nausea: false,
          headache: false,
          fatigue: false,
          moodSwings: false,
          breastTenderness: false,
          acne: false,
        });
      }
      
      setDrawerVisible(true);
    }
  };
  const flowData = menstrualFlow ? {
    value: menstrualFlow,
    emoji: menstrualFlow === 'light' ? '💧' : menstrualFlow === 'medium' ? '🩸' : '🔴',
    text: menstrualFlow.charAt(0).toUpperCase() + menstrualFlow.slice(1)
  } : null;
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
       const log = {
      date: dateKey,
      menstrualFlow: flowData,
      moods: selectedMoodsArray,
      symptoms: selectedSymptomsArray,
      phase: getCurrentPhase(selectedDate).name,
      loggedAt: moment().format(),
    };
    
    setSymptomLogs({
      ...symptomLogs,
      [dateKey]: log,
    });
    
    setDrawerVisible(false);
  };
  const renderCalendar = () => {
    const calendarData = generateCalendarData();
    
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          {calendarData[0].map((day, index) => (
            <Text key={`header-${index}`} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>
        
        {calendarData.slice(1).map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} style={styles.weekRow}>
            {week.map((day, dayIndex) => (
              <TouchableOpacity
                key={`day-${weekIndex}-${dayIndex}`}
                style={[
                  styles.dayCell,
                  !day.inMonth && styles.outOfMonthDay,
                  day.isToday && styles.todayCell,
                  day.isSelected && styles.selectedCell,
                  day.isPeriod && styles.periodCell,
                  day.isOvulation && !day.isPeriod && styles.ovulationCell,
                ]}
                onPress={() => handleDayPress(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    !day.inMonth && styles.outOfMonthText,
                    day.isToday && styles.todayText,
                    day.isSelected && styles.selectedDayText,
                    day.isPeriod && styles.periodDayText,
                  ]}
                >
                  {day.text}
                </Text>
                {day.hasLog && (
                  <View style={styles.logIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };


  const periodStatus = calculatePeriodStatus();
  
  const getAIGeneratedReport = () => {
    // In a real app, this would be generated based on user data
    const phase = getCurrentPhase(selectedDate);
    
    return {
      title: phase.name,
      insights: [
        "Your energy levels may be lower during this phase",
        "Consider gentle exercise like yoga or walking",
        "Hydration is especially important now",
      ],
    };
  };
  
  const report = getAIGeneratedReport();

  // Symptom logging drawer
  const renderSymptomDrawer = () => {
    const isPeriodDay = getCurrentPhase(selectedDate).name === 'Menstrual Phase';
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={drawerVisible}
        onRequestClose={() => setDrawerVisible(false)}
      >
        <View style={styles.drawerContainer}>
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>
                How are you feeling today?
              </Text>
              <TouchableOpacity 
                onPress={() => setDrawerVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
  
            <ScrollView style={styles.drawerBody}>
              {/* Period flow selector (show only on period days) */}
              {isPeriodDay && (
                <MenstrualFlowSelector 
                  selectedFlow={menstrualFlow} 
                  onSelect={(value) => setMenstrualFlow(value)} 
                />
              )}
              
              {/* Mood selector */}
              <MoodSelector 
                selectedMoods={moods} 
                onToggle={(mood) => setMoods({
                  ...moods,
                  [mood]: !moods[mood]
                })} 
              />
              
              {/* Symptoms selector */}
              <SymptomSelector 
                selectedSymptoms={symptoms} 
                onToggle={(symptom) => setSymptoms({
                  ...symptoms,
                  [symptom]: !symptoms[symptom]
                })} 
              />
            </ScrollView>
  
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveSymptomLog}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      
        
        {/* Month Selection */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => setSelectedMonth(moment(selectedMonth).subtract(1, 'month'))}>
            <MaterialIcons name="chevron-left" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.monthYearContainer}>
            <Text style={styles.monthText}>{selectedMonth.format('MMMM')}</Text>
            <Text style={styles.yearText}>{selectedMonth.format('YYYY')}</Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedMonth(moment(selectedMonth).add(1, 'month'))}>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        {/* Calendar */}
        {renderCalendar()}
        
        {/* Calendar Legend */}
        <CalendarLegend />

        
        {/* Cycle Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusNumber}>{periodStatus.daysCount}</Text>
          <Text style={styles.statusMessage}>{periodStatus.message}</Text>
          <Text style={[styles.phaseText, { color: periodStatus.phase.color }]}>
            {periodStatus.phase.name}
          </Text>
        </View>
        
        {/* AI-Generated Reports */}
        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>AI-Generated Insights</Text>
          <Text style={styles.reportSubtitle}>{report.title}</Text>
          {report.insights.map((insight, index) => (
            <View key={`insight-${index}`} style={styles.insightRow}>
              <MaterialIcons name="info" size={16} color={COLORS.primary} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
        
      </ScrollView>
      
      {/* Symptom Logging Drawer */}
      {renderSymptomDrawer()}
      
      {/* Optional: Add a floating action button to log for today */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16 ,
    backgroundColor: COLORS.white,
    
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 8,
  },
  monthYearContainer: {
    width: 120,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  yearText: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 8,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayText: {
    width: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.lightText,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  dayCell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text,
  },
  outOfMonthDay: {
    opacity: 0.3,
  },
  outOfMonthText: {
    color: COLORS.lightText,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  todayText: {
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  selectedCell: {
    backgroundColor: COLORS.mediumPink,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  periodCell: {
    backgroundColor: COLORS.lightPink,
  },
  periodDayText: {
    color: COLORS.text,
  },
  ovulationCell: {
    backgroundColor: COLORS.purpleLight,
  },
  logIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
 
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 8,
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusMessage: {
    fontSize: 16,
    color: COLORS.text,
    marginVertical: 4,
  },
  phaseText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
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


  drawerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '75%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  drawerBody: {
    padding: 16,
    maxHeight: '65%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  stressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stressButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stressButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  stressButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
    margin: 4,
  },
  colorButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  colorButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomButton: {
    width: '48%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  symptomButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  symptomButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  symptomButtonTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
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
export default CycleHealthTracking