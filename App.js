import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HeaderScreen from './Component/HomeScreen';
import DoctorsScreen from './Component/DoctorsScreen';
import CartScreen from './Component/CartScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons for icons
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar, // Fixed tabBar, always visible
          tabBarActiveTintColor: '#FF3366', // Active icon color
          tabBarInactiveTintColor: '#B0B0B0', // Inactive icon color
          tabBarLabelStyle: { display: 'none' }, // Hide label text
          tabBarIconStyle: { marginBottom: -5 }, // Slight margin for icons
        }}
      >
        <Tab.Screen
          name="Home"
          component={HeaderScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Doctors"
          component={DoctorsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="medkit-outline" size={size} color={color} /> // Updated icon name
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
    </NavigationContainer>
  );
};

// Styles for the tab bar
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20, // Position above the bottom of the screen
    left: 20,
    right: 20,
    height: 60, // Standard height for a sleek look
    backgroundColor: '#FFFFFF', // Clean white background
    borderTopWidth: 0, // No border on top
    elevation: 5, // Subtle elevation for depth
    borderRadius: 20, // Rounded corners for aesthetics
    paddingBottom: 5, // Padding for better touch feedback
  },
});

export default App;
