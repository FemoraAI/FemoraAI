import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{userData.name || 'User'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={() => navigation.navigate('ProfileManagement')}
            >
              {userData.profilePic ? (
                <Image 
                  source={{ uri: userData.profilePic }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.defaultAvatarContainer}>
                  <Icon name="person" size={24} color="#FF6B6B" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.circularTrackerContainer}>
        <CircularTracker />
      </View>
    </>
  ), [userData.name, userData.profilePic]);

  const renderQuickActions = useCallback(() => (
    <View style={styles.quickActionsContainer}>
      {/* Empty container kept for future use if needed */}
    </View>
  ), [navigation]);

  return (
    <LinearGradient
      colors={['#FFE5E5', '#FFD4D4', '#FFC2C2']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <FlatList
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        bounces={false}
        overScrollMode="never"
        decelerationRate="normal"
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    height: Dimensions.get('window').height + (Platform.OS === 'ios' ? 50 : StatusBar.currentHeight),
  },
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingTop: Platform.OS === 'ios' ? 45 : StatusBar.currentHeight + 10,
    paddingBottom: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#8E8D8A',
    fontFamily: 'Montserrat Alternates Regular',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B6B',
    fontFamily: 'Montserrat Alternates Regular',
  },
  profileButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD4D4',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  defaultAvatarContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularTrackerContainer: {
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    elevation: 2,
    marginRight: 15,
    padding: 10,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
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
    backgroundColor: 'rgba(250, 212, 216, 0.8)',
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
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 60,
    paddingVertical: 15,
    marginBottom: 25,
  },
});

export default HomeScreen;
