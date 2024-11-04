import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CartItem = ({ item, onRemove, onUpdateQuantity,image }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 0) {
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left side - Item details */}
      <View style={styles.itemInfo}>
      <Image 
        source={{ uri: image }} 
        style={styles.image} 
        resizeMode="contain" 
      />
        
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>

      {/* Right side - Quantity controls */}
      {quantity > 0 ? (
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => handleQuantityChange(-1)}
            style={styles.quantityButton}
          >
            <Icon name="remove" size={20} color="#FF3366" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity
            onPress={() => handleQuantityChange(1)}
            style={styles.quantityButton}
          >
            <Icon name="add" size={20} color="#FF3366" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
  },
  removeButtonText: {
    color: '#FF3366',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CartItem;