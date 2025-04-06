import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Platform, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screen Imports
import HomeScreen from './Component/HomeScreen';
import LoginScreen from './Component/LoginScreen';
import DoctorsScreen from './Component/DoctorsScreen';
import CycleInsights from './Component/CycleInsights';
import CartScreen from './Component/CartScreen';
import ProfileManagementScreen from './Component/ProfileManagementScreen';
import AppointmentSchedulePage from './Component/AppointmentSchedulePage';
import PrescriptionPage from './Component/PrescriptionPage';
import DoctorPage from './Component/DoctorPage';
import OnboardingScreens from './Component/OnboardingScreens';
import PeriodTrackerPage from './Component/PeriodTrackerPage';
import DoctorHomeScreen from './Component/DoctorHomepage';
import AddPrescriptionPage from './Component/AddPrescriptionPage';
import EducationalContent from './Component/EducationalContent';
import Community from './Component/community';

// Context Providers
import { UserProvider, useUser } from './Component/context/UserContext';
import { CartProvider } from './Component/context/CartContext';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Loading Screen Component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#E91E63" />
  </View>
);

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const icon = options.tabBarIcon({
          color: isFocused ? (route.name === 'Home' ? 'white' : '#FF3366') : '#B0B0B0',
          size: route.name === 'Home' ? 32 : 24,
        });

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === 'Home') {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.centerButton}
            >
              <View style={[styles.centerIcon, isFocused && styles.activeCenterIcon]}>
                {icon}
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
          >
            {icon}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Home Stack Navigator
const HomeStack = () => (
  <Stack.Navigator 
    initialRouteName="HomeScreen"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="PeriodTracker" component={PeriodTrackerPage} />
    <Stack.Screen name="ProfileManagement" component={ProfileManagementScreen} />
  </Stack.Navigator>
);

// Doctors Stack Navigator
const DoctorsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorsList" component={DoctorsScreen} />
    <Stack.Screen name="AppointmentSchedule" component={AppointmentSchedulePage} />
    <Stack.Screen name="pres" component={PrescriptionPage} />
    <Stack.Screen name="list" component={DoctorPage} />
  </Stack.Navigator>
);

// Doctor Stack Navigator (for doctor users)
const DoctorStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} />
    <Stack.Screen name="AddPrescription" component={AddPrescriptionPage} />
  </Stack.Navigator>
);

// Education Stack Navigator
const EducationStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Eduscreen" component={EducationalContent} />
  </Stack.Navigator>
);

// Community Stack Navigator
const CommunityStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="comscreen" component={Community} />
  </Stack.Navigator>
);

// Main Tab Navigator for regular users
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Cart"
        component={CycleInsights}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-outline" size={size} color={color} />
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
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Edu"
        component={EducationStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="meditation" size={size+5} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="communityPage"
        component={CommunityStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// Onboarding Stack Navigator
const OnboardingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
    <Stack.Screen name="OnboardingScreens" component={OnboardingScreens} />
  </Stack.Navigator>
);

// Root Navigator that handles authentication state
const RootNavigator = () => {
  const { userData, login } = useUser();
  const { isLoggedIn, isDoctor, needsOnboarding } = userData;
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthInitialized(true);
        return;
      }

      if (!authInitialized) {
        try {
          await login();
          setAuthInitialized(true);
        } catch (error) {
          console.error('Error in auth state change:', error);
          setAuthInitialized(true);
        }
      }
    });

    return () => unsubscribe();
  }, [login, authInitialized]);

  // Determine which navigator to render based on auth state
  if (!isLoggedIn) {
    return <AuthStack />;
  } else if (isDoctor) {
    return <DoctorStack />;
  } else if (needsOnboarding) {
    return <OnboardingStack />;
  } else {
    return <MainTabNavigator />;
  }
};

// Main App Component
const App = () => {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <CartProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </CartProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFE4EC',
    height: 90,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    elevation: 15,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 15,
    paddingTop: 5,
    marginBottom: 0,
  },
  centerButton: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIcon: {
    backgroundColor: 'white',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  activeCenterIcon: {
    backgroundColor: '#FF3366',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    paddingBottom: Platform.OS === 'ios' ? 15 : 10,
  }
});

export default App;