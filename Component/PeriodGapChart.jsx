import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './colors';
import moment from 'moment';

const PeriodGapChart = ({ userData }) => {
  const calculateGaps = () => {
    if (!userData?.lastPeriodStart) {
      return [];
    }

    const gaps = [];
    const cycleLength = parseInt(userData.cycleDays) || 28;
    let currentDate = moment();
    let lastPeriodDate = moment(userData.lastPeriodStart);

    // Calculate last 6 periods
    for (let i = 0; i < 6; i++) {
      const gap = {
        startDate: moment(lastPeriodDate),
        days: cycleLength
      };
      gaps.unshift(gap); // Add to beginning of array
      lastPeriodDate = moment(lastPeriodDate).subtract(cycleLength, 'days');
    }

    return gaps;
  };

  const gaps = calculateGaps();
  const maxGap = Math.max(...gaps.map(gap => gap.days), 28); // Default to 28 if no gaps
  const windowWidth = Dimensions.get('window').width;
  const chartWidth = windowWidth - 32; // 16px padding on each side
  const barWidth = (chartWidth / 12) - 12; // Made bars thinner with less gap
  
  // Calculate dots based on container dimensions
  const containerHeight = 280; // Match container height
  const dotsPerColumn = 30; // More dots vertically
  const dotsPerRow = 40; // More dots horizontally
  const totalDots = dotsPerColumn * dotsPerRow;
  const verticalSpacing = containerHeight / dotsPerColumn;
  const horizontalSpacing = chartWidth / dotsPerRow;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Cycle Length Analysis</Text>
        <Text style={styles.subtitle}>Last 6 months pattern</Text>
      </View>
      <View style={styles.container}>
        {/* Technical dot pattern */}
        <View style={styles.dotPattern}>
          {[...Array(totalDots)].map((_, i) => (
            <View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  left: (i % dotsPerRow) * horizontalSpacing,
                  top: Math.floor(i / dotsPerRow) * verticalSpacing,
                }
              ]}
            />
          ))}
        </View>

        {/* Grid background */}
        <View style={styles.gridBackground}>
          {[...Array(10)].map((_, i) => (
            <View
              key={`horizontal-${i}`}
              style={[
                styles.gridLineHorizontal,
                { top: (i * (280 / 10)) + 'px' }
              ]}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <View
              key={`vertical-${i}`}
              style={[
                styles.gridLineVertical,
                { left: (i * (windowWidth / 20)) + 'px' }
              ]}
            />
          ))}
        </View>

        {/* Chart content */}
        <View style={styles.chartContent}>
          {gaps.length === 0 ? (
            <Text style={styles.emptyText}>Start tracking to see your cycle patterns</Text>
          ) : (
            <View style={styles.barsContainer}>
              {gaps.map((gap, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (gap.days / maxGap) * 200,
                        width: barWidth,
                      }
                    ]}
                  >
                    <Text style={styles.barText}>{gap.days}</Text>
                  </View>
                  <Text style={styles.dateText}>
                    {gap.startDate.format('MMM')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  headerContainer: {
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B67B7B',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#D4A5A5',
    fontWeight: '500',
  },
  container: {
    height: 280,
    backgroundColor: '#FDF6F7',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#D4A5A5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  dotPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.25,
  },
  dot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#C48B9F', // Slightly darker shade for better visibility
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#D4A5A5',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#D4A5A5',
  },
  chartContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    paddingTop: 20,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    backgroundColor: '#E8B4B8',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 8,
    shadowColor: '#D4A5A5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  barText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dateText: {
    marginTop: 8,
    color: '#B67B7B',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    color: '#B67B7B',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PeriodGapChart; 