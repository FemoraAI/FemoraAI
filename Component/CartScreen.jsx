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
    <SafeAreaView>
    <Animated.View style={[{ transform: [{ translateY }], opacity }]}>
      <LinearGradient
        colors={['white', 'white']}
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
                color="#FF6B6B" 
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
    </SafeAreaView>
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
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFE5E5', '#FFF0F5', '#F0F8FF']}
        style={styles.container}
      >
        <Text style={styles.title}>Your Cart</Text>
        
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
  },
  container: {
    flex: 1,
   
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFB6C1', // Light pink
    textAlign: 'center',
  },
  cartListContainer: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 40,
    height: 40,
    
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A4A4A',
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFB6C1', // Light pink
    marginTop: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#FFB6C1', // Light pink
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    marginHorizontal: 15,
    color: '#4A4A4A',
  },
  totalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 15,
  },
  checkoutButton: {
    backgroundColor: '#FFB6C1', // Light pink
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom : 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;