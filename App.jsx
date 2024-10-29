import './gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HeaderScreen from './Component/HomeScreen';
import { UserProvider } from './Component/context/UserContext';

import DoctorsScreen from './Component/DoctorsScreen';
import CartScreen from './Component/CartScreen';
import { CartProvider } from './Component/context/CartContext';
import ProfileManagementScreen from './Component/ProfileManagementScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Separate stack navigator for Home tab
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen 
        name="HomeScreen" 
        component={HeaderScreen}
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ProfileManagement" 
        component={ProfileManagementScreen}
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <UserProvider>

    <CartProvider>
      <NavigationContainer>
        <Tab.Navigator
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
            component={DoctorsScreen}
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
      </NavigationContainer>
    </CartProvider>
    </UserProvider>

  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 5,
    borderRadius: 20,
    paddingBottom: 5,
  },
});

export default App;