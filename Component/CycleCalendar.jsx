import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { COLORS } from '../Component/colors';
import Droplet from './Droplet';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from './context/UserContext';
import { generateCycleInsights } from '../services/cycleInsights';

const CycleCalendar = ({ calendarData, onDayPress }) => {
  const { userData, getCurrentPhase } = useUser();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChillMode, setIsChillMode] = useState(true);
  const currentPhase = getCurrentPhase();
  const [lastFetchDate, setLastFetchDate] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      const today = new Date().toDateString();
      // Only fetch insights if we haven't fetched today or if the phase changed
      if (lastFetchDate !== today) {
        setLoading(true);
        try {
          const dayInCycle = moment().diff(moment(userData.lastPeriodStart), 'days') + 1;
          // Generate insights locally without saving to Firebase
          const newInsights = await generateCycleInsights(currentPhase.name, dayInCycle);
          setInsights(newInsights);
          setLastFetchDate(today);
        } catch (error) {
          console.error('Error generating insights:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInsights();
  }, [currentPhase.name, userData.lastPeriodStart, lastFetchDate]);

  const toggleMode = () => {
    setIsChillMode(!isChillMode);
  };

  const renderHormoneSection = (hormoneName, hormoneData) => (
    <View key={hormoneName} style={styles.hormoneSection}>
      <Text style={[
        styles.hormoneTitle, 
        isChillMode && styles.chillModeText
      ]}>
        {hormoneName}
      </Text>
      <View style={styles.levelIndicator}>
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.levelDot,
              { backgroundColor: i < getLevelValue(hormoneData.level) 
                ? isChillMode ? '#4CAF50' : '#C77DFF' 
                : '#E0E0E0' 
              }
            ]}
          />
        ))}
        <Text style={[
          styles.levelText, 
          isChillMode && { color: '#4CAF50' }
        ]}>
          {hormoneData.level}
        </Text>
      </View>
      <Text style={[
        styles.hormoneDescription, 
        isChillMode && styles.chillModeText
      ]}>
        {isChillMode ? 
          hormoneData.chillDescription : 
          hormoneData.description}
      </Text>
      <Text style={[
        styles.hormoneInteractions, 
        isChillMode && styles.chillModeText
      ]}>
        {isChillMode ? 
          hormoneData.chillInteractions : 
          hormoneData.interactions}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
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
                  day.isOvulation && !day.isPeriod && styles.ovulationCell,
                ]}
                onPress={() => onDayPress(day)}
              >
                {day.isPeriod ? (
                  <Droplet 
                    size={34} 
                    color="#FF4D4D" 
                    fill={userData.loggedPeriods?.some(period => 
                      period.dates.includes(day.date)
                    )}
                  >
                    <Text style={[
                      styles.dayText, 
                      styles.periodDayText,
                      !userData.loggedPeriods?.some(period => 
                        period.dates.includes(day.date)
                      ) && styles.predictedPeriodText
                    ]}>
                      {day.text}
                    </Text>
                  </Droplet>
                ) : (
                  <Text
                    style={[
                      styles.dayText,
                      !day.inMonth && styles.outOfMonthText,
                      day.isToday && styles.todayText,
                      day.isSelected && styles.selectedDayText,
                    ]}
                  >
                    {day.text}
                  </Text>
                )}
                {day.hasLog && (
                  <View style={styles.logIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.todayCell]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
        <View style={styles.legendItem}>
          <Droplet size={16} color="#FF4D4D" fill={true} />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <Droplet size={16} color="#FF4D4D" fill={false} />
          <Text style={styles.legendText}>Predicted</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.ovulationCell]} />
          <Text style={styles.legendText}>Ovulation</Text>
        </View>
      </View>

      <View style={styles.insightsContainer}>
        <View style={styles.insightsHeader}>
          <View style={styles.phaseIndicator}>
            <MaterialIcons name="circle" size={24} color={currentPhase.color} />
            <Text style={styles.phaseText}>{currentPhase.name}</Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.modeToggleButton,
              isChillMode ? styles.chillModeButton : styles.nerdModeButton
            ]} 
            onPress={toggleMode}
          >
            <View style={styles.radioButtonContainer}>
              <View style={[
                styles.radioButtonOuter,
                { borderColor: isChillMode ? '#FFFFFF' : '#C77DFF' }
              ]}>
                <View style={[
                  styles.radioButtonInner,
                  isChillMode ? { backgroundColor: '#FFFFFF' } : { backgroundColor: 'transparent' }
                ]} />
              </View>
              <Text style={[
                styles.modeToggleText,
                isChillMode ? styles.chillModeButtonText : {}
              ]}>
                {isChillMode ? 'Chill Mode' : 'Nerd Mode'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#C77DFF" style={styles.loader} />
        ) : !userData.lastPeriodStart ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataTitle}>Start Your Journey</Text>
            <Text style={styles.noDataText}>
              Log your first period to begin tracking your cycle and receive personalized insights.
            </Text>
          </View>
        ) : insights ? (
          <View style={[
            styles.hormoneLevels,
            isChillMode ? styles.chillModeContainer : {}
          ]}>
            {Object.entries(insights).map(([hormoneName, hormoneData]) => 
              renderHormoneSection(hormoneName, hormoneData)
            )}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const getLevelValue = (level) => {
  switch (level.toLowerCase()) {
    case 'maximum': return 5;
    case 'high': return 4;
    case 'moderate': return 3;
    case 'low': return 2;
    default: return 1;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    color: COLORS.lightText,
    fontSize: 14,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dayCell: {
    width: 40,
    marginBottom: 10,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
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
    color: COLORS.accent,
  },
  selectedCell: {
    backgroundColor: COLORS.accent,
  },
  selectedDayText: {
    color: COLORS.white,
  },
  periodDayText: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingTop: 10,
  },
  predictedPeriodText: {
    color: '#000000',
    paddingTop: 10,
    fontSize: 12,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    color: COLORS.text,
  },
  insightsContainer: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 18,
    marginLeft: 8,
    color: COLORS.text,
  },
  modeToggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nerdModeButton: {
    backgroundColor: '#F0E6FF', // Light purple for nerd mode
  },
  chillModeButton: {
    backgroundColor: '#4CAF50', // Soft yellow for chill mode instead of green
  },
  modeToggleText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  chillModeButtonText: {
    color: COLORS.white,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  hormoneLevels: {
    gap: 24,
    padding: 16,
    borderRadius: 12,
  },
  chillModeContainer: {
    backgroundColor: '#F8F9FA', // Match nerd mode background instead of green
  },
  chillModeText: {
    color: COLORS.text, // Match nerd mode text color instead of white
  },
  hormoneSection: {
    gap: 8,
  },
  hormoneTitle: {
    fontSize: 16,
    color: COLORS.text,
  },
  levelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  levelText: {
    marginLeft: 8,
    color: '#C77DFF',
  },
  hormoneDescription: {
    fontSize: 14,
    color: COLORS.lightText,
    lineHeight: 20,
  },
  hormoneInteractions: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  loader: {
    marginVertical: 20,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    marginTop: 10,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default CycleCalendar;