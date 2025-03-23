import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useUser } from './context/UserContext';
import { COLORS } from './colors';
import { BarChart } from 'react-native-chart-kit';

const PeriodGapChart = () => {
  const { userData } = useUser();
  const { periodGaps = [] } = userData;

  if (periodGaps.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Cycle Length Analysis</Text>
          <Text style={styles.subtitle}>Past {periodGaps.length} Months</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Your cycle length analysis will appear here after tracking your first period.
          </Text>
        </View>
      </View>
    );
  }

  // Define darker feminine colors for the bars
  const barColors = [
    '#A24E68', // Darker Rose
    '#8D3B55', // Even Darker Rose
  ];

  // Prepare data for the chart
  const chartData = {
    labels: periodGaps.map((_, index) => 
      index === periodGaps.length - 1 ? 'Latest' : `${periodGaps.length - index - 1}`
    ),
    datasets: [{
      data: periodGaps,
      colors: periodGaps.map((_, index) => {
        const colorIndex = index % barColors.length;
        return () => barColors[colorIndex];
      })
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    barPercentage: 0.65,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(155, 89, 109, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(93, 71, 58, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '5 5', // More prominent dotted grid
      strokeWidth: 1.4,
      strokeOpacity: 0.5,
    },
    propsForLabels: {
      fontSize: 10,
    },
    fillShadowGradientFrom: '#8D3B55', // Darker gradient start
    fillShadowGradientTo: '#A24E68', // Darker gradient end
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Cycle Length Analysis</Text>
        <Text style={styles.subtitle}>Past {periodGaps.length} Months</Text>
      </View>
      <View style={styles.chartBackground}>
        {/* Dotted background pattern */}
        {[...Array(20)].map((_, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.dotRow}>
            {[...Array(20)].map((_, colIndex) => (
              <View key={`dot-${rowIndex}-${colIndex}`} style={styles.dot} />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.chartWrapper}>
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          showValuesOnTopOfBars={true}
          showBarTops={false}
          fromZero={true}
          withInnerLines={true}
          segments={5}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'left',
    zIndex: 2,
  },
  headerContainer: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'left',
    zIndex: 2,
  },
  chartWrapper: {
    alignItems: 'center',
    marginTop: -10,
    zIndex: 2,
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.lightText,
    fontSize: 14,
    lineHeight: 20,
  },
  chartBackground: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    bottom: 15,
    opacity: 0.07,
    
    zIndex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#8D3B55',
  },
});

export default PeriodGapChart;