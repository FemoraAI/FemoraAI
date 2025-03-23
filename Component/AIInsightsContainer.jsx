import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from './colors';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 16;
const CARD_GAP = 16;
const CARD_WIDTH = Math.min((width - (2 * CONTAINER_PADDING) - (2 * CARD_GAP)) / 3.2, 100);
const CARD_HEIGHT = CARD_WIDTH * (3.5/2.5);

const AIInsightsContainer = ({ insights = [], phase }) => {
  const [showCards, setShowCards] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flippedCards, setFlippedCards] = useState([false, false, false]);
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

  const startJiggleAnimations = () => {
    // Create jiggle animations for each card
    jiggleAnimations.forEach((anim, index) => {
      const delay = index * 150; // Stagger the animations
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    });
  };

  const startGiftAnimation = () => {
    setIsAnimating(true);
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const onGiftAnimationFinish = () => {
    setShowCards(true);
  };

  const flipCard = (index) => {
    const isFlipped = flippedCards[index];
    
    Animated.spring(flipAnimations[index], {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    const newFlippedCards = [...flippedCards];
    newFlippedCards[index] = !isFlipped;
    setFlippedCards(newFlippedCards);

    // Stop jiggle animation when card is flipped
    if (!isFlipped) {
      jiggleAnimations[index].setValue(0);
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
          <Text style={styles.cardText}>{insights[index] || `Insight ${index + 1}`}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: CONTAINER_PADDING,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'left',
    marginBottom: 0,
    paddingHorizontal: 8,
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
    color: COLORS.primary,
    marginTop: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.9,
    position: 'absolute',
    bottom: -24,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  cardFront: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    transform: [{ rotateY: '180deg' }], // Start with text side flipped
  },
  cardBack: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  cardText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
    padding: 8,
  },
  crossPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
});

export default AIInsightsContainer; 