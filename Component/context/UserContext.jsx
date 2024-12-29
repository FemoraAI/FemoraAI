import React, { createContext, useState, useContext } from 'react';
import moment from 'moment';
import { getFirestore, doc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {db,auth} from '../../firebase.config'
const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    // Basic user information
    name: 'Ramanjit',
    email: 'jimmy.sullivan@example.com',
    phone: '',
    address: 'Hostel 34, Stanford Ave, California',
    profileImage: null,
    uid: null,

    // Period tracking data
    lastPeriodStart: moment().subtract(18, 'days').format('YYYY-MM-DD'),
    periodDays: '5', 
    cycleDays: '28', 
    isLoggedIn: false,
    needsOnboarding: false
  });

  const login = async () => {
    setUserData(prev => ({
      ...prev,
      isLoggedIn: true
    }));
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error('Failed to save login state', error);
    }
  };

  const logout = async () => {
    setUserData(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    try {
      await AsyncStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Failed to remove login state', error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (loggedIn === 'true') {
        setUserData(prev => ({
          ...prev,
          isLoggedIn: true
        }));
      }
    } catch (error) {
      console.error('Failed to check login status', error);
    }
  };

  const updateUserData = async (newData) => {
    if (newData.lastPeriodStart) {
      if (!moment(newData.lastPeriodStart, 'YYYY-MM-DD').isValid()) {
        console.error('Invalid date format for lastPeriodStart');
        return;
      }
    }

    if (newData.periodDays) {
      const days = parseInt(newData.periodDays);
      if (isNaN(days) || days < 1 || days > 10) {
        console.error('Invalid period duration');
        return;
      }
    }

    if (newData.phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(newData.phone)) {
        console.error('Invalid phone number format');
        return;
      }
    }

    if (newData.cycleDays) {
      const days = parseInt(newData.cycleDays);
      if (isNaN(days) || days < 21 || days > 35) {
        console.error('Invalid cycle length');
        return;
      }
    }

    setUserData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };

      if (updatedData.isLoggedIn && updatedData.uid) {
        const userRef = doc(db, 'users', updatedData.uid);
        const firestoreData = {...updatedData};
        delete firestoreData.isLoggedIn;
        delete firestoreData.needsOnboarding;

        updateDoc(userRef, firestoreData)
          .catch(error => console.error('Error updating Firestore:', error));
      }

      return updatedData;
    });
  };

  const getNextPeriodDate = () => {
    const lastPeriod = moment(userData.lastPeriodStart);
    const cycleLength = parseInt(userData.cycleDays) || 28;
    return lastPeriod.add(cycleLength, 'days').format('YYYY-MM-DD');
  };

  const getFertilityWindow = () => {
    const nextPeriod = moment(getNextPeriodDate());
    const fertileStart = moment(nextPeriod).subtract(16, 'days');
    const fertileEnd = moment(nextPeriod).subtract(12, 'days');
    
    return {
      start: fertileStart.format('YYYY-MM-DD'),
      end: fertileEnd.format('YYYY-MM-DD')
    };
  };

  const isInPeriod = () => {
    const today = moment();
    const periodStart = moment(userData.lastPeriodStart);
    const periodEnd = moment(userData.lastPeriodStart).add(parseInt(userData.periodDays) || 5, 'days');
    
    return today.isBetween(periodStart, periodEnd, 'day', '[]');
  };

  const getPeriodStatus = () => {
    const today = moment();
    const lastPeriodStart = moment(userData.lastPeriodStart);
    const cycleLength = parseInt(userData.cycleDays) || 28;
    
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

  const getActiveDatesForMonth = (month) => {
    const activeDates = [];
    const lastPeriodStart = moment(userData.lastPeriodStart);
    const cycleLength = parseInt(userData.cycleDays) || 28;
    const periodLength = parseInt(userData.periodDays) || 5;
    let currentCycleStart = moment(lastPeriodStart);
    
    currentCycleStart.subtract(2, 'months');
    
    while (currentCycleStart.isBefore(moment().add(6, 'months'))) {
      if (currentCycleStart.isSame(month, 'month')) {
        for (let i = 0; i < periodLength; i++) {
          const periodDate = moment(currentCycleStart).add(i, 'days');
          if (periodDate.isSame(month, 'month')) {
            activeDates.push({
              day: periodDate.date(),
              type: 'period'
            });
          }
        }
        
        const nextPeriodStart = moment(currentCycleStart).add(cycleLength, 'days');
        const fertileStart = moment(nextPeriodStart).subtract(16, 'days');
        const fertileEnd = moment(nextPeriodStart).subtract(12, 'days');
        
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

  return (
    <UserContext.Provider 
      value={{ 
        userData, 
        updateUserData,
        getNextPeriodDate,
        getFertilityWindow,
        isInPeriod,
        getPeriodStatus,
        getActiveDatesForMonth,
        checkLoginStatus,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
