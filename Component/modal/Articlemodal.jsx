import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

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

const ArticleModal = ({ article, isVisible, onClose, animationValue }) => {
  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const scale = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const opacity = animationValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  if (!article) return null;

  return (
    <BlurView intensity={20} style={styles.modalOverlay}>
      <Animated.View
        style={[
          styles.articleModal,
          {
            transform: [{ translateY }, { scale }],
            opacity,
          },
        ]}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <MaterialIcons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{article.title}</Text>
          <Text style={styles.modalSubtitle}>{article.subtitle}</Text>
        </View>

        <ScrollView 
          style={styles.modalContent}
          contentContainerStyle={styles.scrollContent} // Ensure content is scrollable
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalTitleSection}>
            <View style={styles.modalMetaInfo}>
              <View style={styles.readTimeContainer}>
                <MaterialIcons name="schedule" size={16} color={COLORS.lightText} />
                <Text style={styles.readTime}>{article.readTime}</Text>
              </View>
              <View style={styles.recommendedContainer}>
                <MaterialIcons name="verified" size={16} color={COLORS.secondary} />
                <Text style={styles.modalRecommended}>
                  by {article.recommendedBy}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.modalContentDivider} />

          <Text style={styles.modalText}>{article.content}</Text>
        </ScrollView>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  articleModal: {
    backgroundColor: COLORS.white,
    borderRadius: 25,
    width: width * 0.9, // 90% of screen width
    height: height * 0.8, // 80% of screen height
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    padding: 20,
    paddingBottom: 0,
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 8,
  },
  modalContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Ensure ScrollView expands to fit content
  },
  modalTitleSection: {
    padding: 20,
    paddingTop: 0,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 16,
    fontWeight: '600',
  },
  modalMetaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalContentDivider: {
    height: 1,
    backgroundColor: COLORS.background,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    padding: 20,
    paddingTop: 0,
  },
  modalRecommended: {
    fontSize: 14,
    color: COLORS.secondary,
    marginLeft: 6,
  },
});

export default ArticleModal;