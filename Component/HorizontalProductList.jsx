import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart } from './context/CartContext';
import { db } from '../firebase.config'; // Adjust the import path
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // Get screen width for modal responsiveness
const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [activeTab, setActiveTab] = useState('Description');

  const navigation = useNavigation();

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    closeModal();
    navigation.navigate('Cart');
  };

  const handleAdd = () => {
    addToCart(product, selectedSize);
    closeModal();
  };

  const handleIncrement = () => updateQuantity(product.id, selectedSize, 'increase');
  const handleDecrement = () => updateQuantity(product.id, selectedSize, 'decrease');

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const selectSize = (size) => {
    setSelectedSize(size);
  };

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      {['Description', 'How to use'].map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Description':
        return <Text style={styles.modalDescription}>{product.description || 'No description available.'}</Text>;
      case 'How to use':
        return <Text style={styles.modalDescription}>{product.howtoUse || 'Not Available'}</Text>;
      default:
        return null;
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.card}>
          {/* Fixed height image container */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="contain" // Ensures the image fits within the container
            />
          </View>

          {/* Product details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.weight}>Qty: {product.pcs}</Text>

            <View style={styles.priceContainer}>
              {product.discountPercentage > 0 ? (
                <>
                  <Text style={styles.price}>
                    ₹{(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                  </Text>
                  <Text style={styles.originalPrice}>₹{product.price}</Text>
                </>
              ) : (
                <Text style={styles.price}>₹{product.price}</Text>
              )}
            </View>
          </View>

          {/* Add button or quantity selector */}
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
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.backButton} onPress={closeModal}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Image
              source={{ uri: product.image }}
              style={styles.modalImage}
              resizeMode="contain"
            />
           <View style={styles.indicatorContainer}>
              {Array.isArray(product.images)
                ? product.images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        index === 0 ? styles.activeIndicator : null, // Assuming first image is active
                      ]}
                    />
                  ))
                : [<View key={0} style={styles.activeIndicator} />]}
            </View>

            <ScrollView style={styles.detailsContainer}>
              <Text style={styles.modalTitle}>{product.name}</Text>
              <TouchableOpacity style={styles.wishlistButton}>
                <Ionicons name="heart-outline" size={24} color="#7736A3" />
              </TouchableOpacity>
              {product.discountPercentage > 0 ? (
                <View style={styles.priceContainer}>
                  <Text style={styles.modalPrice}>
                    ₹{(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                  </Text>
                  <Text style={styles.originalModalPrice}>₹{product.price}</Text>
                </View>
              ) : (
                <Text style={styles.modalPrice}>₹{product.price}</Text>
              )}

              {renderTabBar()}
              {renderTabContent()}

              {product.sizes && (
                  <View style={styles.sizeOptions}>
                      {product.sizes.map((size, index) => (
                          <TouchableOpacity
                              key={index}
                              style={[
                                  styles.sizeOptionButton,
                                  selectedSize === size ? styles.selectedSize : {}
                              ]}
                              onPress={() => selectSize(size)}
                          >
                              <Text style={[
                                  styles.sizeOptionText,
                                  selectedSize === size ? { color: '#fff' } : {}
                              ]}>
                                  {size}
                              </Text>
                          </TouchableOpacity>
                      ))}
                  </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAdd}>
                  <Ionicons name="cart-outline" size={20} color="#7736A3" />
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
  <Text style={styles.buyNowText}>Buy Now</Text>
</TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    <View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'space-between', // Push content to top and button to bottom
  },
  imageContainer: {
    height: 120, // Fixed height for the image container
    width: '100%',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1, // Ensures the details take up the remaining space
    width: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: 'medium',
    fontFamily: 'Montserrat Regular',
    color: '#2C3E50',
    textAlign: 'center',
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
    marginTop: 'auto', // Push to the bottom
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
    marginTop: 'auto', // Push to the bottom
  },
  quantityText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.9, // Use a percentage of screen width
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  modalImage: {
    width: width * 0.6, // Use a percentage of screen width
    height: width * 0.6, // Make it square
    marginTop: 50,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3D3D3',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#7736A3',
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2C3E50',
    marginTop: 16,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ECC71',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  addToCartButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#7736A3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#7736A3',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buyNowButton: {
    backgroundColor: '#7736A3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buyNowText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    right: 0,
    top: 16,
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#7736A3',
  },
  tabText: {
    color: '#7736A3',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },
  sizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sizeOptionButton: {
    backgroundColor: 'grey',
    borderWidth: 1,
    borderColor: '#7736A3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  selectedSize: {
    backgroundColor: '#7736A3',
  },
  sizeOptionText: {
    color: '#7736A3',
  },
  selectedSize: {
    backgroundColor: '#7736A3',
  },
  sizeOptionText: {
    color: '#7736A3',
  },
  selectedSize: {
    backgroundColor: '#7736A3',
  },
  sizeOptionText: {
    color: '#7736A3',
  },
  sizeOptionText: {
    color: '#fff',
  },
  originalModalPrice: {
    fontSize: 16,
    color: '#7F8C8D',
    textDecorationLine: 'line-through',
    marginBottom: 16,
    marginLeft: 8,
  },
});

export default HorizontalProductList;
