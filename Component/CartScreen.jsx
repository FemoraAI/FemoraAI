import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from './context/CartContext';
import { useUser } from './context/UserContext';
import { collection, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebase.config'; // Adjust the import path as needed
import { useNavigation } from '@react-navigation/native';
import {updateQuantity, removeFromCart} from '../Component/context/CartContext';


consthandleRemove = (productId, size) => {
  removeFromCart(productId, size);
};
const handleIncrement = (productId, size) => {
  updateQuantity(productId, size, 'increase');
};
const handleDecrement = (productId, size) => {
  updateQuantity(productId, size, 'decrease');
};
const placeOrder = async (cartItems, totalAmount) => {
  const userId = auth.currentUser?.uid;
  try {
    // Create the order object
    const order = {
      userId,
      items: cartItems,
      totalAmount,
      status: 'Placed',
      timestamp: new Date(),
    };

    // Add the order to the 'orders' collection
    const orderRef = await addDoc(collection(db, 'orders'), order);

    // Add the order ID to the user's 'orders' array
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      orders: arrayUnion(orderRef.id), // Add the order ID to the array
    });

    console.log('Order placed successfully! Order ID:', orderRef.id);
    return orderRef.id; // Return the order ID for further use
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// CheckoutModal Component
const CheckoutModal = ({ visible, onClose, totalAmount, cartItems, onOrderSuccess }) => {
  const { userData } = useUser();

  const handlePlaceOrder = async () => {
    try {
      const orderId = await placeOrder(cartItems, totalAmount);
      Alert.alert('Order Placed', `Your order has been placed successfully! Order ID: ${orderId}`);
      onOrderSuccess(); // Call the success handler
      onClose();
    } catch (error) {
      Alert.alert('Order Error', 'Failed to place the order. Please try again.');
      console.error('Error placing order:', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#FFF5F5', '#FFF0F5']}
            style={styles.modalGradient}
          >
            <ScrollView>
              <Text style={styles.modalTitle}>Checkout Details</Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailHeader}>Delivery Address</Text>
                  <Text style={styles.detailText}>{userData.name}</Text>
                  <Text style={styles.detailText}>{userData.address}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailHeader}>Contact Details</Text>
                  <Text style={styles.detailText}>Phone: {userData.phone}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailHeader}>Order Summary</Text>
                  <Text style={styles.detailText}>Total Amount: ₹{totalAmount}</Text>
                </View>

                <TouchableOpacity
                  style={styles.upiButton}
                  onPress={handlePlaceOrder}
                >
                  <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFF" style={styles.upiIcon} />
                  <Text style={styles.upiButtonText}>Pay ₹{totalAmount} with UPI</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

// CartScreen Component
const CartScreen = () => {
  const navigation = useNavigation();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { userData } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleQuantityChange = useCallback((id, type) => {
    updateQuantity(id, type);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((id) => {
    removeFromCart(id);
  }, [removeFromCart]);

  const totalAmount = useMemo(() =>
    cartItems.reduce((acc, item) => {
      const discountedPrice = item.price * (1 - (item.discountPercentage || 0) / 100);
      return acc + discountedPrice * item.quantity;
    }, 0).toFixed(2),
    [cartItems]
  );

  const handlePlaceOrderSuccess = useCallback(() => {
    clearCart(); // Clear the cart after successful order placement
  }, [clearCart]);

  const renderItem = useCallback(({ item, index }) => (
    <CartItem
      item={item}
      index={index}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemoveItem}
    />
  ), [handleQuantityChange, handleRemoveItem]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFE5E5', '#FFF0F5', '#F0F8FF']}
        style={styles.container}
      >
        <Text style={styles.title}>Cart</Text>

        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is empty!</Text>
            <TouchableOpacity
              style={styles.checkOrdersButton}
              onPress={() => {
                navigation.navigate('ProfileManagement'); // Update the navigation logic
                console.log('Navigate to My Profile or Orders section');
              }}
            >
              <Text style={styles.checkOrdersButtonText}>Check Your Orders</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cartListContainer}
            />

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: ₹{totalAmount}</Text>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.buttonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <CheckoutModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          totalAmount={totalAmount}
          cartItems={cartItems}
          onOrderSuccess={handlePlaceOrderSuccess} // Pass the success handler
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

// CartItem Component
const CartItem = React.memo(({ item, index, onQuantityChange, onRemove }) => {
  const discountedPrice = item.price * (1 - (item.discountPercentage || 0) / 100);

  return (
    <View style={styles.cartItemContainer}>
      <LinearGradient
        colors={['#FFF5F5', '#FFF0F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cartItem}
      >
        <Image
          source={{ uri: item.image }} // Use the image URL from Firestore
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => onRemove(item.id)}
              style={styles.deleteButton}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color="#FF9999"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemPrice}>₹{discountedPrice.toFixed(2)} each</Text>
          {item.size && <Text style={styles.itemSize}>{item.size}</Text>}

          <View style={styles.quantityControl}>
            <TouchableOpacity
              onPress={() => onQuantityChange(item.id, 'decrease')}
              style={styles.quantityButton}
            >
              <MaterialCommunityIcons name="minus" size={18} color="#FFF" onPress={handleDecrement} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => onQuantityChange(item.id, 'increase')}
              style={styles.quantityButton}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFF" onPress={handleIncrement}/>
            </TouchableOpacity>
          </View>

          <Text style={styles.itemTotalPrice}>
            Total: ₹{(discountedPrice * item.quantity).toFixed(2)}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
});

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFE5E5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF9999',
    textAlign: 'center',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 24,
    color: '#FF9999',
    marginBottom: 20,
  },
  checkOrdersButton: {
    backgroundColor: '#FF9999',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  checkOrdersButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartListContainer: {
    paddingBottom: 20,
  },
  cartItemContainer: {
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 25,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 20,
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  itemSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9999',
    marginTop: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 5,
  },
  quantityButton: {
    backgroundColor: '#FFB6C1',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
    color: '#4A4A4A',
  },
  totalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    padding: 20,
    marginTop: 10,
    marginBottom: 80,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9999',
    marginBottom: 15,
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#FFB6C1',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9999',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  upiButton: {
    backgroundColor: '#FF9999',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  upiIcon: {
    marginRight: 10,
  },
  upiButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#FF9999',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CartScreen;