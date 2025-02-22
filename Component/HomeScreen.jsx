import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CircularTracker from '../Component/PeriodTrackerPage'; // Ensure this component is correctly imported
import { useUser } from './context/UserContext'; 
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userData } = useUser();

  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);




  const handleAddToCart = useCallback((item) => {
    setCartItems((prevItems) => ({
      ...prevItems,
      [item]: (prevItems[item] || 0) + 1,
    }));
  }, []);

  const handleRemoveFromCart = useCallback((item) => {
    setCartItems((prevItems) => {
      const newQuantity = (prevItems[item] || 0) - 1;
      if (newQuantity <= 0) {
        const { [item]: _, ...rest } = prevItems;
        return rest;
      }
      return {
        ...prevItems,
        [item]: newQuantity,
      };
    });
  }, []);

  const renderProductCard = useCallback(({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleRemoveFromCart(item.name)} style={styles.quantityButton}>
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityCount}>{cartItems[item.name] || 0}</Text>
        <TouchableOpacity onPress={() => handleAddToCart(item.name)} style={styles.quantityButton}>
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [cartItems, handleAddToCart, handleRemoveFromCart]);

  const renderHeader = useCallback(() => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userData.name}</Text>
        </View>
        <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('ProfileManagement')}>
          <Icon name="person-outline" size={24} color="#FF3366" />
        </TouchableOpacity>
      </View>

      {/* Circular Tracker Replacing Period Tracker */}
      <View style={styles.circularTrackerContainer}>
        <CircularTracker />
      </View>
      {/* <SymptomMoodLogger /> */}

{/* 
      <ShopHeading title="FOR YOU" />
      <Text style={styles.header}>Period Pals</Text>
      <HorizontalProductList category="pads" /> */}
    </>
  ), [userData.name]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList

  
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 25,
    fontWeight: 'bold',
    color: 'grey',
    fontSize: 18,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#8E8D8A',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'regular',
    color: '#8E8D8A',
    fontFamily: 'Montserrat Alternates Regular',
  },
  profileIcon: {
    padding: 10,
    alignSelf: 'flex-end',
    marginTop: -40,
  },
  circularTrackerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 2,
    marginRight: 15,
    padding: 10,
    width: 120,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    color: '#8E8D8A',
    fontFamily: 'Montserrat Alternates Regular',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8E8D8A',
    marginVertical: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: '#FAD4D8',
    borderRadius: 5,
    padding: 5,
    width: 30,
    alignItems: 'center',
  },
  quantityText: {
    color: '#FFF',
    fontSize: 16,
  },
  quantityCount: {
    fontSize: 16,
    color: '#8E8D8A',
    marginHorizontal: 5,
  },
});

export default HomeScreen;
