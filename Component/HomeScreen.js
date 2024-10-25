import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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

const categories = [
  { title: 'Menstrual Hygiene Products', items: ['Pads', 'Tampons', 'Cups'] },
  { title: 'Pain Relief Products', items: ['Tablets', 'Patches', 'Teas'] },
 
];

const HomeScreen = () => {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [cartItems, setCartItems] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promotionalMessages.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => ({
      ...prevItems,
      [item]: (prevItems[item] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (item) => {
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
  };

  const renderProductCard = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={require('../assets/15.png')} style={styles.productImage} />
      <Text style={styles.productName}>{item}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleRemoveFromCart(item)} style={styles.quantityButton}>
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityCount}>{cartItems[item] || 0}</Text>
        <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.quantityButton}>
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Jimmy Sullivan</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon} onPress={() => setModalVisible(true)}>
            <Icon name="person-outline" size={24} color="#FF3366" />
          </TouchableOpacity>
          {/* Profile Management Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>User Profile</Text>
                <View style={styles.profileInfo}>
                  <Image source={require('../assets/15.png')} style={styles.profileImage} />
                  <Text style={styles.profileName}>Jimmy Sullivan</Text>
                  <Text style={styles.profileEmail}>jimmy.sullivan@example.com</Text>
                </View>
                {/* Options */}
                <TouchableOpacity style={styles.optionButton}>
                  <Icon name="create-outline" size={24} color="#FFF" />
                  <Text style={styles.optionText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                  <Icon name="card-outline" size={24} color="#FFF" />
                  <Text style={styles.optionText}>Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                  <Icon name="cart-outline" size={24} color="#FFF" />
                  <Text style={styles.optionText}>Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                  <Icon name="settings-outline" size={24} color="#FFF" />
                  <Text style={styles.optionText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton}>
                  <Icon name="log-out-outline" size={24} color="#FFF" />
                  <Text style={styles.optionText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Improved Search Bar with Icon */}
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={20} color="#FF3366" style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, isFocused && styles.searchInputFocused]}
              placeholder="Search for products or services"
              placeholderTextColor="#FF3366"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </View>
        {/* Promotional Message Section */}
        <View style={styles.promoContainer}>
          <Text style={styles.promoTitle}>{promotionalMessages[currentPromoIndex].title}</Text>
          <Text style={styles.promoText}>{promotionalMessages[currentPromoIndex].description}</Text>
        </View>
        {/* Product Categories */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{item.title}</Text>
              <FlatList
                data={item.items}
                keyExtractor={(item) => item}
                renderItem={renderProductCard}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles for the Header
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FF3366',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3366',
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
    borderColor: '#FF3366',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginTop: 10,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FF3366',
    marginLeft: 10,
    borderWidth: 0,
  },
  searchInputFocused: {
    outlineWidth: 0,
  },
  searchIcon: {},
  promoContainer: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#FFB6C1',
    borderRadius: 10,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3366',
  },
  promoText: {
    fontSize: 16,
    color: '##FFF',
    textAlign: 'center',
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3366',
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 2,
    marginRight: 15,
    padding: 10,
    width: 100,
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF3366',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: '#FFCCCB',
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
    color: '#FF3366',
    marginHorizontal: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '50%', // Cover half of the screen
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3366',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#FF3366',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  optionButton: {
    marginVertical: 5,
    paddingVertical: 15,
    backgroundColor: '#FFCCCB',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
  },
  optionText: {
    color: '#FF3366',
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 10,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FF3366',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3366',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});

export default HomeScreen;
