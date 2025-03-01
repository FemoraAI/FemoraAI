import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ArticleModal from './modal/Articlemodal'; // Import the reusable modal

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#F5EEE6',
  primary: '#E0876A',
  secondary: '#7FB685',
  accent: '#F4B942',
  text: '#2D3436',
  lightText: '#636E72',
  white: '#FFFFFF',
  cardBg: '#FFFAF4',
};

const ARTICLES = [
  {
    id: '1',
    title: 'Understanding Your Cycle Together',
    subtitle: 'Cycle Syncing Guide',
    recommendedBy: 'Dr. Jane Smith',
    content: `Understanding your menstrual cycle is crucial for both partners. The cycle consists of four main phases: menstrual, follicular, ovulatory, and luteal. Each phase brings unique changes in energy levels, mood, and physical comfort.

During the menstrual phase, energy levels may be lower, and emotional support is particularly valuable. The follicular phase brings increasing energy and creativity. The ovulatory phase often sees peak energy and sociability. The luteal phase may bring some premenstrual symptoms that require understanding and support.

Partners can help by tracking these phases together, adjusting activities to match energy levels, and providing appropriate emotional and physical support throughout the cycle.`,
    icon: 'favorite',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Intimacy and Your Period',
    subtitle: 'Maintaining Connection',
    recommendedBy: 'Dr. Emily Johnson',
    content: `Maintaining intimacy during menstruation doesn't have to be challenging. This guide explores various ways to stay connected with your partner during this time.

Physical intimacy can continue if both partners are comfortable, but there are also many non-physical ways to maintain closeness. This might include spending quality time together, having deeper conversations, or engaging in shared activities.

Communication is key during this time. Being open about comfort levels, needs, and boundaries helps both partners feel understood and respected.`,
    icon: 'heart-broken',
    readTime: '4 min read',
  },
  {
    id: '3',
    title: 'Supporting Your Partner',
    subtitle: 'Practical Tips',
    recommendedBy: 'Dr. Sarah Lee',
    content: `Supporting a partner during their menstrual cycle involves understanding, empathy, and practical assistance. Here are key ways to provide support:

Understanding physical symptoms and offering appropriate help, whether that's providing pain relief, comfortable environments, or taking on more household responsibilities.

Emotional support is equally important. Being patient, understanding mood changes, and offering a listening ear can make a significant difference.

Learn to recognize your partner's needs during different phases of their cycle and adapt your support accordingly.`,
    icon: 'people',
    readTime: '6 min read',
  },
];

const RecommendedReads = () => {
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [isArticleExpanded, setIsArticleExpanded] = useState(false);
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const cardScaleAnimation = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef(null);

  // Calculate card width including margin
  const CARD_WIDTH = width * 0.7;
  const CARD_MARGIN = 16;
  const ITEM_SIZE = CARD_WIDTH + CARD_MARGIN;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(scrollPosition / ITEM_SIZE);
    if (newIndex !== activeArticleIndex && newIndex >= 0 && newIndex < ARTICLES.length) {
      setActiveArticleIndex(newIndex);
    }
  };

  useEffect(() => {
    if (isArticleExpanded) {
      animateModal(true);
    }
  }, [isArticleExpanded]);

  const animateModal = (show) => {
    Animated.parallel([
      Animated.spring(modalAnimation, {
        toValue: show ? 1 : 0,
        tension: 500,
        friction: 100,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardScaleAnimation, {
        toValue: show ? 0.8 : 1,
        duration: 100,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!show) setIsArticleExpanded(false);
    });
  };

  const handleCardPress = (index) => {
    setActiveArticleIndex(index);
    setIsArticleExpanded(true);
    animateModal(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recommended Reads</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.articlesContainer}
        snapToInterval={ITEM_SIZE}
        decelerationRate={0.7}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToAlignment="center"
      >
        {ARTICLES.map((article, index) => (
          <Animated.View
            key={article.id}
            style={[
              styles.articleCardContainer,
              {
                width: CARD_WIDTH,
                marginRight: CARD_MARGIN,
              },
              index === activeArticleIndex && {
                transform: [{ scale: cardScaleAnimation }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.articleCard,
                index === activeArticleIndex && styles.activeArticleCard,
              ]}
              onPress={() => handleCardPress(index)}
              activeOpacity={0.9}
            >
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleSubtitle}>{article.subtitle}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.readTime}>{article.readTime}</Text>
                <View style={styles.recommendedContainer}>
                  <MaterialIcons name="verified" size={16} color={COLORS.secondary} />
                  <Text style={styles.articleRecommended}>
                    by {article.recommendedBy}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {ARTICLES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeArticleIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <Modal transparent visible={isArticleExpanded} onRequestClose={() => animateModal(false)}>
        <ArticleModal
          article={ARTICLES[activeArticleIndex]}
          isVisible={isArticleExpanded}
          onClose={() => animateModal(false)}
          animationValue={modalAnimation}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'left',
    margin: 20,
  },
  articlesContainer: {
    paddingHorizontal: width * 0.075,
    paddingBottom: 20,
    alignItems: 'center',
  },
  articleCardContainer: {
    width: width * 0.7,
    marginRight: 16,
  },
  articleCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minHeight: 140,
    flex: 1,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 6,
  },
  articleSubtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 8,
  },
  cardFooter: {
    marginTop: 'auto',
    flexDirection: 'column',
    gap: 8,
  },
  readTime: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  recommendedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleRecommended: {
    fontSize: 14,
    color: COLORS.secondary,
    marginLeft: 6,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    marginBottom:10
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
    transform: [{ scale: 1 }],
  },
  inactiveDot: {
    backgroundColor: COLORS.lightText,
    opacity: 0.5,
  },
});

export default RecommendedReads;