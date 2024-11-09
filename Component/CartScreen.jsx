import React, { useCallback, useMemo,useState} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Modal,
  ScrollView,
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SubscriptionModal from './SubscriptionModal'; // Added import for SubscriptionModal
import { useCart } from './context/CartContext';
import { useUser } from './context/UserContext'; // Added import for user context

const CheckoutModal = ({ visible, onClose, totalAmount }) => {
  const { userData } = useUser();

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
                  onPress={() => {
                    console.log('Processing UPI payment for:', totalAmount);
                    // Implement UPI payment logic here
                  }}
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
const CartItem = React.memo(({ item, index, onQuantityChange, onRemove }) => {
  const translateY = React.useRef(new Animated.Value(50)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View style={[styles.cartItemContainer, { transform: [{ translateY }], opacity }]}>
      <LinearGradient
        colors={['#FFF5F5', '#FFF0F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cartItem}
      >
        <Image 
          source={item.image} 
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
          
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)} each</Text>
          
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              onPress={() => onQuantityChange(item.id, 'decrease')} 
              style={styles.quantityButton}
            >
              <MaterialCommunityIcons name="minus" size={18} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity 
              onPress={() => onQuantityChange(item.id, 'increase')} 
              style={styles.quantityButton}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemTotalPrice}>
            Total: ₹{(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
});

const CartScreen = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { userDetails } = useUser(); // Get user details from context
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] = useState(false);

  const handleQuantityChange = useCallback((id, type) => {
    updateQuantity(id, type);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((id) => {
    removeFromCart(id);
  }, [removeFromCart]);

  const totalAmount = useMemo(() => 
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2),
    [cartItems]
  );

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
  onPress={() => setIsSubscriptionModalVisible(true)}
>
  <Text style={styles.buttonText}>Proceed to Checkout</Text>
</TouchableOpacity>
        </View>
        <SubscriptionModal
  visible={isSubscriptionModalVisible}
  onClose={() => setIsSubscriptionModalVisible(false)}
  onSubscribe={() => {
    setIsSubscriptionModalVisible(false);
    // Here you can add logic to handle the subscription
    // For now, we'll just open the checkout modal
    setIsModalVisible(true);
  }}
/>
        <CheckoutModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          totalAmount={totalAmount}

        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    color: '#FFE5E5',
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
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    width: 60,
    height: 60,
    borderRadius: 20,
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
    marginTop: 20,
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
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#FF9999',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
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
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
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