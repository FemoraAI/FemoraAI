import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart } from './context/CartContext';
import { db } from '../firebase.config'; // Adjust the import path
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => addToCart(product);
  const handleIncrement = () => updateQuantity(product.id, 'increase');
  const handleDecrement = () => updateQuantity(product.id, 'decrease');

  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: product.image }} 
        style={styles.image} 
        resizeMode="contain" 
      />
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
            <Ionicons name="remove" color="#fff" size={24} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={handleIncrement}>
            <Ionicons name="add" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const HorizontalProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Track whether the component is still mounted

    const fetchProducts = async () => {
      try {
        // Create a Firestore query to fetch products by category
        const productsQuery = query(
          collection(db, 'products'), // Reference the 'products' collection
          where('category', '==', category) // Filter by category
        );

        // Execute the query
        const querySnapshot = await getDocs(productsQuery);

        // Map the documents to an array of product objects
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Include the document ID
          ...doc.data(), // Include all other fields
        }));

        // Update the state only if the component is still mounted
        if (isMounted) {
          setProducts(productsData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching products: ', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [category]); // Only re-run when the category changes

  const renderProduct = ({ item }) => <ProductCard product={item} />;

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
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
    fontFamily: 'Montserrat Regular',
    color: '#2C3E50',
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
    borderColor: '#2ECC71',
    borderWidth: 1,
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