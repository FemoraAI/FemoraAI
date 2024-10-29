import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const products = [
  {
    id: '1',
    name: 'Whisper Ultra Soft Sanitary Pads',
    image:'https://m.media-amazon.com/images/I/61rffJJbRML._AC_SL1500_.jpg',
    price: 41,
    pcs:30,
    originalPrice: 52,
  },
  {
    id: '2',
    name: 'Whisper Ultra Soft Sanitary Pads',
    image: 'https://m.media-amazon.com/images/I/61rffJJbRML._AC_SL1500_.jpg',
    price: 39,
    pcs:30,
    originalPrice: 62,
  },
  {
    id: '3',
    name: 'Whisper Ultra Soft Sanitary Pads',
    image: 'https://m.media-amazon.com/images/I/61rffJJbRML._AC_SL1500_.jpg',
    price: 39,
    pcs : 30,
    originalPrice: 62,
  },
  {
    id: '4',
    name: 'Whisper Ultra Soft Sanitary Pads',
    image: 'https://m.media-amazon.com/images/I/61rffJJbRML._AC_SL1500_.jpg',
    price: 39,
    pcs : 30,
    originalPrice: 62,
  },
  
];

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => setQuantity(1);
  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(0, prev - 1));

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain"  />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.weight}>Qty: {product.pcs}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{product.price}</Text>
        <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
      </View>
      {quantity === 0 ? (
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={handleDecrement}>
            <Ionicons name="remove" color="#fff" size={18} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={handleIncrement}>
            <Ionicons name="add" color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const HorizontalProductList = () => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 160,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'medium',
    fontFamily : 'Montserrat Regular',
    color: '#2C3E50',
  },
  localName: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  weight: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: '#7F8C8D',
    textDecorationLine: 'line-through',
  },
  addButton: {
    borderColor : '#2ECC71',
    borderWidth : 1,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#2ECC71',
    fontWeight: 'bold',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
});

export default HorizontalProductList;
