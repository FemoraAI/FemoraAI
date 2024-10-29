import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
} from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width * 0.9;
const BANNER_HEIGHT = 150;

const BannerCarousel = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      scrollToIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const scrollToIndex = (index) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    scrollViewRef.current?.scrollTo({
      x: index * BANNER_WIDTH,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / BANNER_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {banners.map((banner, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bannerContainer,
              { opacity: currentIndex === index ? fadeAnim : 0.7 },
            ]}
          >
            <Image
              source={{ uri: banner.imageUrl }}
              style={styles.banner}
              resizeMode="cover"
            />
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => scrollToIndex(index)}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  scrollView: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
  },
  banner: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
    width: 12,
  },
});

export default BannerCarousel;