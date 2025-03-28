import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 16;
const CARD_GAP = 16;
const CARD_WIDTH = Math.min((width - (2 * CONTAINER_PADDING) - (2 * CARD_GAP)) / 3.2, 100);
const CARD_HEIGHT = CARD_WIDTH * (3.5/2.5);

const AIInsightsContainer = ({ insights = [], phase }) => {
  const [showCards, setShowCards] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flippedCards, setFlippedCards] = useState([false, false, false]);
  const [hasRevealedCards, setHasRevealedCards] = useState(false);
  const flipAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const jiggleAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  const lottieRef = useRef(null);
  const previousPhase = useRef(phase);

  // Load persisted state when component mounts
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const persistedState = await AsyncStorage.getItem(`insights_state_${phase}`);
        if (persistedState) {
          const { showCards: persistedShowCards, flippedCards: persistedFlippedCards, hasRevealedCards: persistedHasRevealedCards } = JSON.parse(persistedState);
          setShowCards(persistedShowCards);
          setFlippedCards(persistedFlippedCards);
          setHasRevealedCards(persistedHasRevealedCards);
          
          // If cards were previously revealed, set their flip animations
          if (persistedFlippedCards) {
            persistedFlippedCards.forEach((isFlipped, index) => {
              if (isFlipped) {
                flipAnimations[index].setValue(1);
                jiggleAnimations[index].setValue(0);
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading persisted state:', error);
      }
    };

    loadPersistedState();
  }, [phase]);

  useEffect(() => {
    // Reset animation to first frame when component mounts
    if (lottieRef.current) {
      lottieRef.current.reset();
    }
    // Start jiggle animations when cards are shown
    if (showCards) {
      startJiggleAnimations();
    }
  }, [showCards]);

  useEffect(() => {
    // Reset state when phase changes
    if (phase !== previousPhase.current) {
      setShowCards(false);
      setFlippedCards([false, false, false]);
      setHasRevealedCards(false);
      previousPhase.current = phase;
    }
  }, [phase]);

  // Save state whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(
          `insights_state_${phase}`,
          JSON.stringify({
            showCards,
            flippedCards,
            hasRevealedCards
          })
        );
      } catch (error) {
        console.error('Error saving state:', error);
      }
    };

    saveState();
  }, [showCards, flippedCards, hasRevealedCards, phase]);

  const startJiggleAnimations = () => {
    // Create jiggle animations for each card
    jiggleAnimations.forEach((anim, index) => {
      const delay = index * 100;
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    });
  };

  const startGiftAnimation = () => {
    if (hasRevealedCards) return;
    setIsAnimating(true);
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const onGiftAnimationFinish = () => {
    setShowCards(true);
  };

  const flipCard = (index) => {
    // Prevent flipping if card is already flipped or if we're not in the current phase
    if (flippedCards[index] || phase !== previousPhase.current) return;
    
    Animated.spring(flipAnimations[index], {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = true;
    setFlippedCards(newFlippedCards);

    // Stop jiggle animation when card is flipped
    jiggleAnimations[index].setValue(0);

    // Check if all cards are flipped
    if (newFlippedCards.every(card => card)) {
      setHasRevealedCards(true);
    }
  };

  const renderCard = (index) => {
    const frontInterpolate = flipAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    });

    const backInterpolate = flipAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '360deg']
    });

    const jiggleRotate = jiggleAnimations[index].interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['-3deg', '0deg', '3deg']
    });

    const frontAnimatedStyle = {
      transform: [
        { rotateY: frontInterpolate },
        ...(flippedCards[index] ? [] : [{ rotate: jiggleRotate }])
      ]
    };
    
    const backAnimatedStyle = {
      transform: [{ rotateY: backInterpolate }]
    };

    // Determine which image to use based on the card index
    let frontImageSource;
    switch (index) {
      case 0:
        frontImageSource = require('../assets/meditate.png');
        break;
      case 1:
        frontImageSource = require('../assets/hydrate.png');
        break;
      case 2:
        frontImageSource = require('../assets/nourishsmartly.png');
        break;
      default:
        frontImageSource = require('../assets/meditate.png'); // Fallback to meditate.png
    }

    return (
      <TouchableOpacity 
        key={index}
        onPress={() => flipCard(index)}
        style={styles.cardContainer}
      >
        <Animated.View style={[styles.card, styles.cardBack, frontAnimatedStyle]}>
          <Image 
            source={require('../assets/card.png')}
            style={styles.cardBackImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardFront, backAnimatedStyle]}>
          <Image 
            source={frontImageSource}
            style={styles.cardFrontImage}
            resizeMode="cover"
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
        style={styles.gradientContainer}
      >
        <Text style={styles.mainTitle}>Personalised Insights</Text>
        {!showCards ? (
          <View style={styles.giftWrapper}>
            <TouchableOpacity 
              style={styles.giftContainer}
              onPress={startGiftAnimation}
              disabled={isAnimating}
            >
              <LottieView
                ref={lottieRef}
                source={require('../assets/animations/gift.json')}
                autoPlay={false}
                loop={false}
                style={styles.giftAnimation}
                onAnimationFinish={onGiftAnimationFinish}
                speed={1}
                progress={0}
                resizeMode="contain"
              />
              {!isAnimating && (
                <Text style={styles.tapText}>Tap to reveal your insights</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardsWrapper}>
            <View style={styles.cardsContainer}>
              {[0, 1, 2].map(renderCard)}
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  gradientContainer: {
    padding: CONTAINER_PADDING,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
    textAlign: 'left',
    marginBottom: 0,
    paddingHorizontal: 8,
    fontFamily: 'Montserrat Alternates Regular',
  },
  giftWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    height: 180,
  },
  giftContainer: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  tapText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B6B',
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.9,
    position: 'absolute',
    bottom: -24,
    fontFamily: 'Montserrat Alternates Regular',
  },
  giftAnimation: {
    width: 200,
    height: 200,
    position: 'absolute',
    transform: [{ scale: 2 }],
  },
  cardsWrapper: {
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: CARD_GAP,
    width: '100%',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    perspective: 1000,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  cardFront: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    transform: [{ rotateY: '180deg' }],
  },
  cardBack: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  cardFrontImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default AIInsightsContainer; 