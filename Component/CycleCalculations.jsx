import moment from 'moment';

// Define PHASES directly in this file instead of importing
export const PHASES = {
  menstrual: {
    id: 'menstrual',
    name: 'Menstrual Phase',
    color: '#FF5A5A',
    description: 'Period days when bleeding occurs',
  },
  follicular: {
    id: 'follicular',
    name: 'Follicular Phase',
    color: '#FF9F7F',
    description: 'Preparation for ovulation',
  },
  ovulation: {
    id: 'ovulation',
    name: 'Ovulatory Phase',
    color: '#FFD700',
    description: 'Fertility peak, egg release',
  },
  luteal: {
    id: 'luteal',
    name: 'Luteal Phase',
    color: '#B19CD9',
    description: 'Post-ovulation phase',
  },
};

export const generateCalendarData = (selectedMonth, userData, symptomLogs, selectedDate) => {
  const cycleLength = parseInt(userData?.cycleDays) || 28;
  const periodLength = parseInt(userData?.periodDays) || 5;
  
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
  
  const calculatePeriodStatus = (userData, cycleLength, periodLength, isInPeriod) => {
  // Replace with your actual calculation logic
  const today = moment();
  let daysCount = null;
  let message = '';
  let phase = '';
  
  // Get the current phase
  const currentPhase = getCurrentPhase(today, userData);
  
  // Format phase object to string if needed
  if (typeof currentPhase === 'object' && currentPhase !== null) {
    phase = currentPhase.name || 'Unknown';
  } else {
    phase = currentPhase || 'Unknown';
  }
  
  // Calculate days until period or days into period
  if (isInPeriod) {
    // If in period, calculate days into period
    const periodStartDate = moment(userData.lastPeriodDate);
    daysCount = today.diff(periodStartDate, 'days') + 1;
    message = `Day ${daysCount} of your period`;
  } else {
    // If not in period, calculate days until next period
    const nextPeriodDate = moment(userData.lastPeriodDate).add(cycleLength, 'days');
    while (nextPeriodDate.isBefore(today)) {
      nextPeriodDate.add(cycleLength, 'days');
    }
    daysCount = nextPeriodDate.diff(today, 'days');
    message = `${daysCount} days until your next period`;
  }
  
  return { daysCount, message, phase };
};

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

export const getCurrentPhase = (date, userData) => {
  const cycleLength = parseInt(userData?.cycleDays) || 28;
  const periodLength = parseInt(userData?.periodDays) || 5;
  
  if (!userData?.lastPeriodStart) return PHASES.follicular;
  
  const cycleDay = date.diff(moment(userData.lastPeriodStart), 'days') % cycleLength;

  if (cycleDay < periodLength) return PHASES.menstrual;
  if (cycleDay < cycleLength * 0.3) return PHASES.follicular;
  if (cycleDay < cycleLength * 0.5) return PHASES.ovulation;
  return PHASES.luteal;
};



export const calculatePeriodStatus = (userData, cycleLength, periodLength, isInPeriod) => {
  // Replace with your actual calculation logic
  const today = moment();
  let daysCount = null;
  let message = '';
  let phase = '';
  
  // Get the current phase
  const currentPhase = getCurrentPhase(today, userData);
  
  // Format phase object to string if needed
  if (typeof currentPhase === 'object' && currentPhase !== null) {
    phase = currentPhase.name || 'Unknown';
  } else {
    phase = currentPhase || 'Unknown';
  }
  
  // Calculate days until period or days into period
  if (isInPeriod) {
    // If in period, calculate days into period
    const periodStartDate = moment(userData.lastPeriodDate);
    daysCount = today.diff(periodStartDate, 'days') + 1;
    message = `Day ${daysCount} of your period`;
  } else {
    // If not in period, calculate days until next period
    const nextPeriodDate = moment(userData.lastPeriodDate).add(cycleLength, 'days');
    while (nextPeriodDate.isBefore(today)) {
      nextPeriodDate.add(cycleLength, 'days');
    }
    daysCount = nextPeriodDate.diff(today, 'days');
    message = `${daysCount} days until your next period`;
  }
  
  return { daysCount, message, phase };
};

