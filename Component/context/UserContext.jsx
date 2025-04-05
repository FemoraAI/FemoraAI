"use client"

import { createContext, useState, useContext, useCallback, useEffect } from "react"
import moment from "moment"
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { db, auth } from '../../firebase.config'
import { getAuth } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { db, auth } from '../../firebase.config'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    uid: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: null,
    lastPeriodStart: null,
    periodDays: null,
    cycleDays: null,
    isLoggedIn: false,
    isDoctor: false,
    needsOnboarding: true,
    createdAt: null,
    lastUpdated: null,
    onboardingCompleted: false,
    expectedPeriodDate: null,
    periodGaps: [],
    lastPeriodChecked: null,
    isLatePeriod: false,
    daysLate: 0,
    loggedPeriods: [],
    authToken: null,
    currentPhase: null,
    phaseInsights: {
      menstrual: { lastSeen: null },
      follicular: { lastSeen: null },
      ovulation: { lastSeen: null },
      luteal: { lastSeen: null }
    }
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const checkDoctorStatus = useCallback(async (formattedPhone) => {
    try {
      const doctorsRef = collection(db, "doctors")
      const doctorQuery = query(doctorsRef, where("phone", "==", formattedPhone))
      const doctorQuerySnapshot = await getDocs(doctorQuery)
      return !doctorQuerySnapshot.empty
    } catch (error) {
      console.error("Error checking doctor status:", error)
      return false
    }
  }, [])

  const login = async () => {
    const auth = getAuth()
    const currentUser = auth.currentUser

    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        const formattedPhone = currentUser.phoneNumber
        const isDoctor = await checkDoctorStatus(formattedPhone)

        if (userDoc.exists()) {
          // For existing users, check if they've completed onboarding
          const userData = userDoc.data()
          const onboardingCompleted = userData.onboardingCompleted || false
          
          setUserData((prev) => ({
            ...prev,
            ...userData,
            isLoggedIn: true,
            isDoctor,
            // Only set needsOnboarding to false if onboarding is actually completed
            needsOnboarding: !onboardingCompleted && !isDoctor,
          }))
          
          // console.log("User login - Existing user:", { 
          //   isDoctor, 
          //   needsOnboarding: !onboardingCompleted && !isDoctor,
          //   onboardingCompleted
          // })
        } else {
          // For new users, always set needsOnboarding to true unless they're a doctor
          setUserData((prev) => ({
            ...prev,
            uid: currentUser.uid,
            phone: formattedPhone,
            isLoggedIn: true,
            isDoctor,
            needsOnboarding: !isDoctor, // Doctors don't need onboarding
            onboardingCompleted: false,
          }))
          
          // console.log("User login - New user:", { 
          //   isDoctor, 
          //   needsOnboarding: !isDoctor 
          // })
          
          // For new users, create a basic document in Firestore
          if (!isDoctor) {
            const timestamp = new Date().toISOString()
            const userRef = doc(db, "users", currentUser.uid)
            await setDoc(userRef, {
              uid: currentUser.uid,
              phone: formattedPhone,
              createdAt: timestamp,
              lastUpdated: timestamp,
              onboardingCompleted: false,
            }, { merge: true })
          }
        }
      } catch (error) {
        console.error("Error in login:", error)
      }
  const login = async () => {
    const auth = getAuth()
    const currentUser = auth.currentUser

    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        const formattedPhone = currentUser.phoneNumber
        const isDoctor = await checkDoctorStatus(formattedPhone)

        if (userDoc.exists()) {
          // For existing users, check if they've completed onboarding
          const userData = userDoc.data()
          const onboardingCompleted = userData.onboardingCompleted || false
          
          setUserData((prev) => ({
            ...prev,
            ...userData,
            isLoggedIn: true,
            isDoctor,
            // Only set needsOnboarding to false if onboarding is actually completed
            needsOnboarding: !onboardingCompleted && !isDoctor,
          }))
          
          // console.log("User login - Existing user:", { 
          //   isDoctor, 
          //   needsOnboarding: !onboardingCompleted && !isDoctor,
          //   onboardingCompleted
          // })
        } else {
          // For new users, always set needsOnboarding to true unless they're a doctor
          setUserData((prev) => ({
            ...prev,
            uid: currentUser.uid,
            phone: formattedPhone,
            isLoggedIn: true,
            isDoctor,
            needsOnboarding: !isDoctor, // Doctors don't need onboarding
            onboardingCompleted: false,
          }))
          
          // console.log("User login - New user:", { 
          //   isDoctor, 
          //   needsOnboarding: !isDoctor 
          // })
          
          // For new users, create a basic document in Firestore
          if (!isDoctor) {
            const timestamp = new Date().toISOString()
            const userRef = doc(db, "users", currentUser.uid)
            await setDoc(userRef, {
              uid: currentUser.uid,
              phone: formattedPhone,
              createdAt: timestamp,
              lastUpdated: timestamp,
              onboardingCompleted: false,
            }, { merge: true })
          }
        }
      } catch (error) {
        console.error("Error in login:", error)
      }
    }
  }

  const logout = async () => {
    try {
      // Clear AsyncStorage to prevent data persistence between users
      await AsyncStorage.clear()
      
      // Reset user state
      setUserData((prev) => ({
        ...prev,
        isLoggedIn: false,
        isDoctor: false,
  }

  const logout = async () => {
    try {
      // Clear AsyncStorage to prevent data persistence between users
      await AsyncStorage.clear()
      
      // Reset user state
      setUserData((prev) => ({
        ...prev,
        isLoggedIn: false,
        isDoctor: false,
        uid: null,
        needsOnboarding: true,
        needsOnboarding: true,
        name: "",
        email: "",
        phone: "",
        address: "",
        profileImage: null,
        lastPeriodStart: null,
        periodDays: null,
        cycleDays: null,
        createdAt: null,
        lastUpdated: null,
        onboardingCompleted: false,
        expectedPeriodDate: null,
        periodGaps: [],
        lastPeriodChecked: null,
        isLatePeriod: false,
        daysLate: 0
      }))
        daysLate: 0
      }))
    } catch (error) {
      console.error("Error during logout:", error)
      console.error("Error during logout:", error)
    }
  }
  }

  const updateUserData = async (newData) => {
    try {
      const auth = getAuth()
      const currentUser = auth.currentUser

      if (!currentUser) {
        throw new Error("No authenticated user found")
      }

      const timestamp = new Date().toISOString()
      const userRef = doc(db, "users", currentUser.uid)

      let expectedPeriodDate = null
      if (newData.lastPeriodStart && (!userData.lastPeriodStart || newData.lastPeriodStart !== userData.lastPeriodStart)) {
        expectedPeriodDate = moment(newData.lastPeriodStart)
          .add(newData.cycleDays || userData.cycleDays || 28, 'days')
          .format('YYYY-MM-DD')
      }

      const firestoreData = {
        ...(newData.name && { name: newData.name }),
        ...(newData.phone && { phone: newData.phone }),
        ...(newData.address && { address: newData.address }),
        ...(newData.profileImage && { profileImage: newData.profileImage }),
        ...(newData.lastPeriodStart && { lastPeriodStart: newData.lastPeriodStart }),
        ...(newData.periodDays && { periodDays: newData.periodDays }),
        ...(newData.cycleDays && { cycleDays: newData.cycleDays }),
        ...(newData.onboardingCompleted && { onboardingCompleted: newData.onboardingCompleted }),
        ...(newData.isDoctor && { isDoctor: newData.isDoctor }),
        ...(expectedPeriodDate && { expectedPeriodDate }),
        lastUpdated: timestamp,
      }

      await setDoc(userRef, firestoreData, { merge: true })

      // Only update needsOnboarding if onboardingCompleted is explicitly set
      const needsOnboardingUpdate = newData.onboardingCompleted !== undefined
        ? !newData.onboardingCompleted && !userData.isDoctor
        : userData.needsOnboarding

      setUserData(prev => ({
        ...prev,
        ...firestoreData,
        isLoggedIn: true,
        needsOnboarding: needsOnboardingUpdate,
        needsOnboarding: needsOnboardingUpdate,
      }))
      
      console.log("User data updated:", { 
        needsOnboarding: needsOnboardingUpdate,
        onboardingCompleted: newData.onboardingCompleted || userData.onboardingCompleted
      })
      
      console.log("User data updated:", { 
        needsOnboarding: needsOnboardingUpdate,
        onboardingCompleted: newData.onboardingCompleted || userData.onboardingCompleted
      })
    } catch (error) {
      console.error("Error updating user data:", error)
      setError(error.message)
      throw error
    }
  }

  const getNextPeriodDate = () => {
    const lastPeriod = moment(userData.lastPeriodStart)
    const cycleLength = Number.parseInt(userData.cycleDays) || 28
    return lastPeriod.add(cycleLength, "days").format("YYYY-MM-DD")
  }

  const getFertilityWindow = () => {
    const nextPeriod = moment(getNextPeriodDate())
    const fertileStart = moment(nextPeriod).subtract(16, "days")
    const fertileEnd = moment(nextPeriod).subtract(12, "days")

    return {
      start: fertileStart.format("YYYY-MM-DD"),
      end: fertileEnd.format("YYYY-MM-DD"),
    }
  }

  const isInPeriod = () => {
    const today = moment()
    const periodStart = moment(userData.lastPeriodStart)
    const periodEnd = moment(userData.lastPeriodStart).add(Number.parseInt(userData.periodDays) || 5, "days")

    return today.isBetween(periodStart, periodEnd, "day", "[]")
  }

  const getPeriodStatus = () => {
    const today = moment()
    const lastPeriodStart = moment(userData.lastPeriodStart)
    const cycleLength = Number.parseInt(userData.cycleDays) || 28

    if (isInPeriod()) {
      const currentDay = today.diff(lastPeriodStart, "days") + 1
      return {
        isOnPeriod: true,
        message: `Period day ${currentDay}`,
        daysCount: currentDay,
      }
    }

    const nextPeriodDate = moment(lastPeriodStart)
    while (nextPeriodDate.isSameOrBefore(today)) {
      nextPeriodDate.add(cycleLength, "days")
    }

    const daysToNext = nextPeriodDate.diff(today, "days")
    return {
      isOnPeriod: false,
      message: `days until\nnext period`,
      daysCount: daysToNext,
    }
  }

  const getActiveDatesForMonth = (month) => {
    const activeDates = []
    const lastPeriodStart = moment(userData.lastPeriodStart)
    const cycleLength = Number.parseInt(userData.cycleDays) || 28
    const periodLength = Number.parseInt(userData.periodDays) || 5
    const currentCycleStart = moment(lastPeriodStart)

    currentCycleStart.subtract(2, "months")

    while (currentCycleStart.isBefore(moment().add(6, "months"))) {
      if (currentCycleStart.isSame(month, "month")) {
        for (let i = 0; i < periodLength; i++) {
          const periodDate = moment(currentCycleStart).add(i, "days")
          if (periodDate.isSame(month, "month")) {
            activeDates.push({
              day: periodDate.date(),
              type: "period",
            })
          }
        }

        const nextPeriodStart = moment(currentCycleStart).add(cycleLength, "days")
        const fertileStart = moment(nextPeriodStart).subtract(16, "days")
        const fertileEnd = moment(nextPeriodStart).subtract(12, "days")

        if (fertileStart.isSame(month, "month") || fertileEnd.isSame(month, "month")) {
          for (let date = moment(fertileStart); date.isSameOrBefore(fertileEnd); date.add(1, "day")) {
            if (date.isSame(month, "month")) {
              activeDates.push({
                day: date.date(),
                type: "fertile",
              })
            }
          }
        }
      }
      currentCycleStart.add(cycleLength, "days")
    }

    return activeDates
  }

  const updatePhaseAndInsights = useCallback(async (phase, hasOpenedInsights = false) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      const userRef = doc(db, "users", currentUser.uid);
      const timestamp = new Date().toISOString();

      const updateData = {
        currentPhase: phase,
        phaseInsights: {
          ...userData.phaseInsights,
          [phase]: { 
            lastSeen: hasOpenedInsights ? timestamp : userData.phaseInsights[phase].lastSeen 
          }
        },
        lastUpdated: timestamp
      };

      await setDoc(userRef, updateData, { merge: true });
      
      setUserData(prev => ({
        ...prev,
        ...updateData
      }));
    } catch (error) {
      console.error("Error updating phase and insights:", error);
      setError(error.message);
      throw error;
    }
  }, [userData.phaseInsights]);

  const getCurrentPhase = useCallback(() => {
    const today = moment();
    const lastPeriodStart = moment(userData.lastPeriodStart);
    const cycleLength = Number.parseInt(userData.cycleDays) || 28;
    const periodLength = Number.parseInt(userData.periodDays) || 5;

    const currentCycleStart = moment(lastPeriodStart);
    while (currentCycleStart.add(cycleLength, "days").isAfter(today)) {
      currentCycleStart.subtract(cycleLength, "days");
    }

    const dayInCycle = today.diff(currentCycleStart, "days") + 1;

    let phase;
    if (dayInCycle <= periodLength) {
      phase = { name: "Menstrual Phase", color: "#FF4D6D" };
    } else if (dayInCycle < cycleLength * 0.3) {
      phase = { name: "Follicular Phase", color: "#C77DFF" };
    } else if (dayInCycle < cycleLength * 0.5) {
      phase = { name: "Ovulation Phase", color: "#FFD166" };
    } else {
      phase = { name: "Luteal Phase", color: "#F8A978" };
    }

    if (phase.name !== userData.currentPhase) {
      updatePhaseAndInsights(phase.name.toLowerCase().replace(" phase", ""));
    }

    return phase;
  }, [userData.lastPeriodStart, userData.cycleDays, userData.periodDays, userData.currentPhase, updatePhaseAndInsights]);

  const shouldShowPeriodCheck = () => {
    if (!userData.expectedPeriodDate) return false
    
    const today = moment().startOf('day')
    const expectedDate = moment(userData.expectedPeriodDate).startOf('day')
    const lastChecked = userData.lastPeriodChecked ? moment(userData.lastPeriodChecked).startOf('day') : null
    
    return (!lastChecked || !lastChecked.isSame(today)) && 
           (today.isSameOrAfter(expectedDate) || userData.isLatePeriod)
  }

  const handlePeriodCheck = async (hasPeriodStarted) => {
    try {
      const today = moment().startOf('day')
      const expectedDate = moment(userData.expectedPeriodDate)
      const userRef = doc(db, "users", userData.uid)
      
      if (hasPeriodStarted) {
        const lastPeriod = moment(userData.lastPeriodStart)
        const gap = today.diff(lastPeriod, 'days')
        
        const newPeriodGaps = [...userData.periodGaps, gap].slice(-6)
        
        const nextExpectedDate = today.clone().add(userData.cycleDays || 28, 'days')
        
        const updateData = {
          lastPeriodStart: today.format('YYYY-MM-DD'),
          expectedPeriodDate: nextExpectedDate.format('YYYY-MM-DD'),
          lastPeriodChecked: today.format('YYYY-MM-DD'),
          periodGaps: newPeriodGaps,
          isLatePeriod: false,
          daysLate: 0
        }
        
        await setDoc(userRef, updateData, { merge: true })
        setUserData(prev => ({ ...prev, ...updateData }))
      } else {
        const daysLate = today.diff(expectedDate, 'days')
        
        const updateData = {
          lastPeriodChecked: today.format('YYYY-MM-DD'),
          isLatePeriod: true,
          daysLate: daysLate
        }
        
        await setDoc(userRef, updateData, { merge: true })
        setUserData(prev => ({ ...prev, ...updateData }))
      }
    } catch (error) {
      console.error("Error updating period check:", error)
      throw error
    }
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        isLoading,
        error,
        updateUserData,
        login,
        logout,
        getNextPeriodDate,
        getFertilityWindow,
        isInPeriod,
        getPeriodStatus,
        getActiveDatesForMonth,
        getCurrentPhase,
        shouldShowPeriodCheck,
        handlePeriodCheck,
        updatePhaseAndInsights
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export default UserContext

