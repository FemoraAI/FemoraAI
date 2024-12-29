import './gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Screen Imports
import HeaderScreen from './Component/HomeScreen';
import LoginScreen from './Component/LoginScreen';
import DoctorsScreen from './Component/DoctorsScreen';
import CartScreen from './Component/CartScreen';
import ProfileManagementScreen from './Component/ProfileManagementScreen';
import AppointmentSchedulePage from './Component/AppointmentSchedulePage';
import PrescriptionPage from './Component/PrescriptionPage';
import DoctorPage from './Component/DoctorPage';
import OnboardingScreens from './Component/OnboardingScreens';
import PeriodTrackerPage from './Component/PeriodTrackerPage';

// Context Providers
import { UserProvider, useUser } from './Component/context/UserContext';
import { CartProvider } from './Component/context/CartContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home Stack Navigator
const HomeStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HeaderScreen} />
      <Stack.Screen name="PeriodTracker" component={PeriodTrackerPage} />
      <Stack.Screen name="ProfileManagement" component={ProfileManagementScreen} />
    </Stack.Navigator>
  );
};

// Doctors Stack Navigator
const DoctorsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorsList" component={DoctorsScreen} />
      <Stack.Screen name="AppointmentSchedule" component={AppointmentSchedulePage} />
      <Stack.Screen name="pres" component={PrescriptionPage} />
      <Stack.Screen name="list" component={DoctorPage} />
    </Stack.Navigator>
  );
};

// Main Navigation Stack
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FF3366',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarLabelStyle: { display: 'none' },
        tabBarIconStyle: { marginBottom: -5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Doctors"
        component={DoctorsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="medkit-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// App Content Component
const AppContent = () => {
  const { userData, checkLoginStatus } = useUser();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <CartProvider>
      <NavigationContainer>
        {!userData.isLoggedIn ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        ) : userData.needsOnboarding ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={OnboardingScreens} />
          </Stack.Navigator>
        ) : (
          <MainNavigator />
        )}
      </NavigationContainer>  
    </CartProvider>
  );
  
  
};

// Main App Component
const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: '#FFE4EC',
    borderTopWidth: 0,
    elevation: 5,
    borderRadius: 20,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default App;