import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ShopHeading from './ShopHeading';
import PeriodTracker from './periodtracker';
import { useUser } from './context/UserContext';
import HorizontalProductList from './HorizontalProductList';
import { useNavigation } from '@react-navigation/native';

const promotionalMessages = [
  {
    title: 'TRACK YOUR CYCLE!',
    description: 'Use our app to track your period and get personalized insights.',
    icon: 'timer',
  },
  {
    title: 'LIMITED TIME DISCOUNT!',
    description: 'Get 20% off on your first purchase. Hurry up, offer valid till stock lasts!',
    icon: 'cash',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userData } = useUser();

  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch promotional messages every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promotionalMessages.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://your-backend-api.com/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Add item to cart
  const handleAddToCart = useCallback((item) => {
    setCartItems((prevItems) => ({
      ...prevItems,
      [item]: (prevItems[item] || 0) + 1,
    }));
  }, []);

  // Remove item from cart
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

  // Render individual product card
  const renderProductCard = useCallback(({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
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

  // Render header for FlatList
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
        
        {/* Search Bar */}
        
      </View>
      
      {/* Promotional Message Section */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <PeriodTracker />
      </View>

      {/* Product section starts here */}
      <View>
        <ShopHeading title="FOR YOU" />
      </View>

      <Text style={styles.header}>Period Pals</Text>
      <View>
        <HorizontalProductList category="pads" />
      </View>
    </>
  ), [userData.name, isFocused]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductCard}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

// Styles for the HomeScreen component
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  container: {
    paddingHorizontal: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderColor: '#8E8D8A',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginTop: 10,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#8E8D8A',
    marginLeft: 10,
    borderWidth: 0,
  },
  searchInputFocused: {
    outlineWidth: 0,
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
    fontWeight: 'regular',
    color: '#8E8D8A',
    fontFamily: 'Montserrat Alternates Regular',
    marginTop: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#777',
    marginVertical: 2,
    textAlign: 'center',
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