import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Menstrual Cup', price: 10.99, image: require('../assets/15.png'), quantity: 1 },
    { id: 2, name: 'Pain Relief Medicine', price: 5.99, image: require('../assets/15.png'), quantity: 1 },
    { id: 3, name: 'Vitamin Supplements', price: 15.99, image: require('../assets/15.png'), quantity: 1 },
    // Add more items as needed
  ]);

  const handleQuantityChange = (id, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: type === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)} each</Text>
        
        {/* Quantity Control */}
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => handleQuantityChange(item.id, 'decrease')} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange(item.id, 'increase')} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Total Price for Quantity */}
        <Text style={styles.itemTotalPrice}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
      </View>

      {/* Remove Button */}
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Shopping Cart</Text>
        
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cartListContainer}
        />

        {/* Total and Checkout Button */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${totalAmount}</Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.buttonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartListContainer: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#FF8DA1',
    padding: 5,
    borderRadius: 5,
    width: 25,
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  removeButton: {
    backgroundColor: '#FF8DA1',
    borderRadius: 5,
    padding: 5,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#FF8DA1',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
