import React, { useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from './context/CartContext';

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
    <SafeAreaView style={styles.safeArea} >
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
            onPress={() => {
              console.log('Proceeding to checkout with total:', totalAmount);
            }}
          >
            <Text style={styles.buttonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
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
});

export default CartScreen;