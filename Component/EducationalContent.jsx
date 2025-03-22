"use client"

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Modal,
  Animated,
  Alert,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArticleModal from "./modal/Articlemodal";
import LottieView from "lottie-react-native";

// Soft, modern color palette
const COLORS = {
  background: "#FFF5F7", // Light pink background
  primary: "#FF85A2", // Main pink color
  secondary: "#FFB6C1", // Light pink secondary
  accent: "#FF3366", // Accent pink
  text: "#2D3436", // Dark text
  lightText: "#8E8D8A", // Light text
  white: "#FFFFFF",
  green: "#4BD0A0",
  pink: "#FFE4EC", // Soft pink for backgrounds
  lightBlue: "#90CAF9",
  sand: "#E6DDC6",
  coral: "#FF6B6B",
  teal: "#4ECDC4",
  purple: "#9B89B3",
  mint: "#98DFAF",
  peach: "#FFAA8C",
  lavender: "#E6E6FA",
  gradient1: "#FFB6C1",
  gradient2: "#FF69B4",
  buttonText: "#FFFFFF",
  candyShadow: "#FF1493",
};

const activityColors = [
  COLORS.coral,
  COLORS.teal,
  COLORS.purple,
  COLORS.mint,
  COLORS.peach,
  COLORS.lavender,
];

const getRandomColor = () => {
  return activityColors[Math.floor(Math.random() * activityColors.length)];
};

const quickContentData = [
  {
    id: 1,
    title: "Coping with Stress",
    backgroundColor: COLORS.secondary,
    duration: "12:00 min",
    icon: "play-circle-outline",
    image: "https://images.pexels.com/photos/3758104/pexels-photo-3758104.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    title: "Balance Within",
    backgroundColor: COLORS.primary,
    duration: "7:00 min",
    icon: "play-circle-outline",
    image: "https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const mindQuizData = [
  {
    id: 1,
    title: "Mind mastery challenge",
    description: "Test your mental wellness knowledge",
    backgroundColor: COLORS.green,
    icon: "brain",
    image: require("../assets/15.png"), // Placeholder - replace with your actual image path
  },
  {
    id: 2,
    title: "Harmony within you",
    description: "Discover your inner balance",
    backgroundColor: COLORS.blue,
    icon: "meditation",
    image: require("../assets/15.png"), // Placeholder - replace with your actual image path
  },
];

const recommendedArticles = [
  {
    id: 1,
    title: "Understanding Mental Wellness",
    subtitle: "A Guide to Better Mental Health",
    recommendedBy: "Dr. Sarah Wilson",
    content: "Mental wellness is a crucial part of our overall health. This comprehensive guide explores various aspects of mental health and provides practical tips for maintaining a healthy mind.",
    readTime: "5 min read",
    type: "Mental Health",
    image: "https://images.pexels.com/photos/3759658/pexels-photo-3759658.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    title: "Mindful Living",
    subtitle: "Daily Practices for Peace",
    recommendedBy: "Dr. Michael Chang",
    content: "Mindfulness is more than just meditation. Learn how to incorporate mindful practices into your daily routine for a more balanced and peaceful life.",
    readTime: "7 min read",
    type: "Mindfulness",
    image: "https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    title: "The Power of Positive Thinking",
    subtitle: "Reshape Your Mindset",
    recommendedBy: "Dr. Emily Brooks",
    content: "Discover how positive thinking can transform your life. This article explores the science behind positive psychology and provides practical exercises.",
    readTime: "6 min read",
    type: "Psychology",
    image: "https://images.pexels.com/photos/6953870/pexels-photo-6953870.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const MainContent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [userPreferencesModalVisible, setUserPreferencesModalVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(0)).current;

  const closeModal = () => {
    setModalVisible(false);
    setSelectedArticle(null);
  };

  const handleArticlePress = (article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const optionDescriptions = {
    // Dietary preferences
    "Vegetarian 🥗": "Leaf-ing the meat behind! Your superpower is turning plants into pure deliciousness.",
    "Non-Vegetarian 🥩": "The ultimate food explorer! No dish is too adventurous for your taste buds.",
    "Vegan 🌱": "Plant-based warrior! Saving the planet one tofu block at a time.",
    "Flexitarian 🥑": "Best of both worlds! You're like a dietary chameleon, adapting with style.",
    
    // Energy peaks
    "Morning Bird 🌄": "Early bird gets the worm... and probably all the hot coffee too!",
    "Afternoon Power ⭐️": "Lunch hour superhero! Your energy peaks when others are food-coma-ing.",
    "Night Spirit 🌌": "Moonlight's bestie! While others snooze, you're in your groove.",
    "Random Bursts ✨": "You're like a surprise party - nobody knows when you'll pop up with energy!",
    
    // Sleep patterns
    "Sleeping like a baby 👶": "Plot twist: Actually sleeping through the night, unlike real babies!",
    "Decent ZZZs 💤": "Not all heroes wear capes, some just have a consistent bedtime.",
    "Tossing & turning 🔄": "Your bed is basically a salad spinner - everything's mixed up!",
    "What is sleep? 🤔": "Coffee is your love language, and insomnia is your sidekick.",
  };

  // Update the questions array with more comprehensive questions
  const questions = [
    {
      id: 1,
      question: "What's your dietary style? 🍽️",
      options: ["Vegetarian 🥗", "Non-Vegetarian 🥩", "Vegan 🌱", "Flexitarian 🥑"],
      key: "dietary_preference",
    },
    {
      id: 2,
      question: "When do you feel like your best superhero self? ⚡️",
      options: ["Morning Bird 🌄", "Afternoon Power ⭐️", "Night Spirit 🌌", "Random Bursts ✨"],
      key: "energy_peak",
    },
    {
      id: 3,
      question: "How's your sleep game lately? 😴",
      options: ["Sleeping like a baby 👶", "Decent ZZZs 💤", "Tossing & turning 🔄", "What is sleep? 🤔"],
      key: "sleep_quality",
    },
    {
      id: 4,
      question: "What's your stress-buster superpower? 💪",
      options: ["Workout Wonder 🏃‍♀️", "Zen Master 🧘‍♀️", "Social Butterfly 🦋", "Creative Soul 🎨"],
      key: "stress_relief",
    },
    {
      id: 5,
      question: "Your ideal adventure buddy would be... 🤝",
      options: ["Gym Partner 🏋️‍♀️", "Meditation Guru ��‍♂️", "Party Friend 🎉", "Nature Explorer 🏞️"],
      key: "activity_preference",
    },
    {
      id: 6,
      question: "Pick your wellness superpower! ✨",
      options: ["Mind Mastery 🧠", "Body Goals 💪", "Sleep Expert 😴", "Zen Warrior 🏹"],
      key: "wellness_focus",
    },
    {
      id: 7,
      question: "Your dream recharge spot would be... 🌟",
      options: ["Beach Vibes 🏖️", "Mountain Peace 🏔️", "Cozy Home 🏡", "City Energy 🌆"],
      key: "recharge_preference",
    },
    {
      id: 8,
      question: "What's your energy kryptonite? 😅",
      options: ["Work Chaos 💼", "Phone Addiction 📱", "Netflix Marathons 🎬", "Social Media 📸"],
      key: "energy_drain",
    },
    {
      id: 9,
      question: "Your perfect morning starts with... ☀️",
      options: ["Epic Workout 🏃‍♀️", "Peaceful Meditation 🧘‍♀️", "Yummy Breakfast 🥑", "Extra Sleep 😴"],
      key: "morning_routine",
    },
    {
      id: 10,
      question: "Choose your wellness sidekick! 🦸‍♂️",
      options: ["Fitness Watch ⌚", "Meditation App 🧘‍♀️", "Journal 📔", "Sleep Tracker 😴"],
      key: "wellness_tool",
    },
    {
      id: 11,
      question: "Your wellness theme song would be... 🎵",
      options: ["Energetic Pop 🎤", "Chill Beats 🎧", "Nature Sounds 🌿", "Classical Zen 🎻"],
      key: "audio_preference",
    },
    {
      id: 12,
      question: "Your self-care superpower is... 💝",
      options: ["Bubble Baths 🛁", "Reading Books 📚", "Dancing Wild 💃", "Cooking Joy 👩‍🍳"],
      key: "selfcare_activity",
    },
    {
      id: 13,
      question: "Pick your wellness squad goal! 🎯",
      options: ["Strong & Fierce 💪", "Calm & Centered 🧘‍♀️", "Happy & Free 🦋", "Balanced & Bright ⭐"],
      key: "wellness_goal",
    },
    {
      id: 14,
      question: "Your happiness fuel is... 🌈",
      options: ["Friend Time 👯‍♀️", "Me Time 🧘‍♀️", "Adventure Time 🗺️", "Creative Time 🎨"],
      key: "happiness_source",
    },
    {
      id: 15,
      question: "Choose your energy potion! ⚡",
      options: ["Green Smoothie 🥤", "Coffee Magic ☕", "Power Nap 😴", "Dance Break 💃"],
      key: "energy_boost",
    },
    {
      id: 16,
      question: "Your wellness journey feels like... 🚀",
      options: ["Adventure Time 🗺️", "Peaceful River 🌊", "Mountain Climb 🏔️", "Garden Growing 🌱"],
      key: "journey_perception",
    }
  ];

  // Check if the user has already completed the preferences
  useEffect(() => {
    const checkPreferences = async () => {
      const hasCompleted = await AsyncStorage.getItem("hasCompletedPreferences");
      if (!hasCompleted) {
        setUserPreferencesModalVisible(true);
      }
    };
    checkPreferences();
  }, []);

  // Handle user response with drawer animation
  const handleResponse = (response) => {
    if (isProcessing) return;
    
    setSelectedOption(response);
    setUserResponses((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].key]: response,
    }));

    setDrawerVisible(true);
    Animated.timing(drawerAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleNext = () => {
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setDrawerVisible(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        AsyncStorage.setItem("userPreferences", JSON.stringify(userResponses));
        AsyncStorage.setItem("hasCompletedPreferences", "true");
        setUserPreferencesModalVisible(false);
      }
    });
  };

  // Add this new function to reset preferences
  const resetPreferences = async () => {
    try {
      await AsyncStorage.removeItem("hasCompletedPreferences");
      await AsyncStorage.removeItem("userPreferences");
      setUserResponses({});
      setCurrentQuestionIndex(0);
      setUserPreferencesModalVisible(true);
    } catch (error) {
      console.error("Error resetting preferences:", error);
    }
  };

  // Add this function to handle long press on the header title
  const handleLongPressHeader = () => {
    Alert.alert(
      "Reset Preferences",
      "Would you like to reset your preferences and restart the onboarding?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          onPress: resetPreferences,
          style: "destructive"
        }
      ]
    );
  };

  // Render the user preferences modal
  const renderUserPreferencesModal = () => (
    <Modal
      transparent
      visible={userPreferencesModalVisible}
      animationType="fade"
      onRequestClose={() => setUserPreferencesModalVisible(false)}
    >
      <View style={styles.preferencesModalContainer}>
        <View style={styles.preferencesModalContent}>
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../assets/animations/welcome.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View>
          <Text style={styles.preferencesModalTitle}>
            Let's Get to Know You! ⋆｡°✩
          </Text>
          <Text style={styles.preferencesModalQuestion}>
            {questions[currentQuestionIndex].question}
          </Text>
          <View style={styles.preferencesModalOptions}>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.preferencesModalOption,
                  {
                    backgroundColor: index % 2 === 0 ? COLORS.pink : COLORS.lavender,
                  },
                  selectedOption === option && styles.selectedOption,
                ]}
                onPress={() => !isProcessing && handleResponse(option)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.preferencesModalOptionText,
                  selectedOption === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            <Animated.View
              style={[
                styles.descriptionDrawer,
                {
                  maxHeight: drawerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                  opacity: drawerAnimation,
                  marginTop: drawerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 16],
                  }),
                },
              ]}
            >
              {selectedOption && (
                <>
                  <Text style={styles.descriptionText}>
                    {optionDescriptions[selectedOption] || "Great choice! You're on your way to wellness stardom! ✨"}
                  </Text>
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                  >
                    <Text style={styles.nextButtonText}>
                      {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
                    </Text>
                    <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </View>

          <View style={styles.progressIndicator}>
            {questions.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  currentQuestionIndex === index && styles.progressDotActive,
                  index < currentQuestionIndex && styles.progressDotCompleted,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity 
            onLongPress={handleLongPressHeader}
            delayLongPress={1000}
          >
            <Text style={styles.headerTitle}>Wellness Journey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationIcon}>
            <MaterialIcons name="notifications-none" size={24} color={COLORS.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={COLORS.lightText} style={styles.searchIcon} />
          <TextInput 
            placeholder="Search for wellness activities..."
            style={styles.searchInput}
            placeholderTextColor={COLORS.lightText}
          />
        </View>

        {/* Activity Cards */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Today's Activities</Text>
          <View style={styles.activityGrid}>
            <TouchableOpacity style={[styles.activityCard, { backgroundColor: COLORS.coral }]}>
              <MaterialCommunityIcons name="meditation" size={32} color={COLORS.white} />
              <Text style={styles.activityTitle}>Meditation</Text>
              <Text style={styles.activityDuration}>10 min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.activityCard, { backgroundColor: COLORS.teal }]}>
              <MaterialCommunityIcons name="yoga" size={32} color={COLORS.white} />
              <Text style={styles.activityTitle}>Yoga</Text>
              <Text style={styles.activityDuration}>20 min</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <MaterialIcons name="trending-up" size={24} color={COLORS.primary} />
              <Text style={styles.progressTitle}>Weekly Streak</Text>
            </View>
            <Text style={styles.progressValue}>5 Days</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "71%" }]} />
            </View>
          </View>
        </View>

        {/* Daily Inspiration */}
        <View style={styles.inspirationSection}>
          <Text style={styles.sectionTitle}>Daily Inspiration</Text>
          <View style={styles.inspirationCard}>
            <MaterialCommunityIcons name="lightbulb-outline" size={24} color={COLORS.primary} />
            <Text style={styles.inspirationText}>
              "Tranquility begins with a calm mind and peaceful thoughts."
            </Text>
          </View>
        </View>

        {/* Quick Content Cards */}
        <View style={styles.quickContentSection}>
          <Text style={styles.sectionTitle}>Continue your journey</Text>
          <View style={styles.quickContentContainer}>
            {quickContentData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.quickCard, { backgroundColor: item.backgroundColor }]}
              >
                <Image 
                  source={{ uri: item.image }}
                  style={styles.quickCardBackground}
                  blurRadius={1.5}
                />
                <View style={styles.quickCardOverlay} />
                <View style={styles.quickCardContent}>
                  <Text style={styles.quickCardTitle}>{item.title}</Text>
                  <Text style={styles.quickCardDuration}>{item.duration}</Text>
                </View>
                <MaterialIcons
                  name={item.icon}
                  size={32}
                  color={COLORS.white}
                  style={styles.playIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your wellness stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.accent }]}>
                <MaterialCommunityIcons name="meditation" size={20} color={COLORS.white} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>28 min</Text>
                <Text style={styles.statLabel}>Mindfulness</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.primary }]}>
                <MaterialCommunityIcons name="sleep" size={20} color={COLORS.white} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>7.2 hrs</Text>
                <Text style={styles.statLabel}>Avg. Sleep</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.green }]}>
                <MaterialIcons name="loop" size={20} color={COLORS.white} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>5 days</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Mind Challenges */}
        <View style={styles.challengesSection}>
          <Text style={styles.sectionTitle}>Mind Challenges</Text>
          <View style={styles.challengesGrid}>
            {mindQuizData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.challengeCard, { backgroundColor: getRandomColor() }]}
              >
                <View style={styles.challengeIconContainer}>
                  <MaterialCommunityIcons name={item.icon} size={24} color={COLORS.white} />
                </View>
                <Text style={styles.challengeTitle}>{item.title}</Text>
                <Text style={styles.challengeDescription}>{item.description}</Text>
                <View style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start</Text>
                  <MaterialIcons name="arrow-forward" size={16} color={COLORS.text} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recommended Articles */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Articles</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recommendedScrollView}
          >
            {recommendedArticles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => handleArticlePress(article)}
              >
                <Image source={{ uri: article.image }} style={styles.articleImage} />
                <View style={styles.articleContent}>
                  <Text style={styles.articleType}>{article.type}</Text>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <View style={styles.articleFooter}>
                    <MaterialIcons name="access-time" size={14} color={COLORS.lightText} />
                    <Text style={styles.articleDuration}>{article.readTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Article Modal */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="fade"
      >
        <ArticleModal
          article={selectedArticle}
          isVisible={modalVisible}
          onClose={closeModal}
          animationValue={modalAnimation}
        />
      </Modal>

      {/* User Preferences Modal */}
      {renderUserPreferencesModal()}
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color={COLORS.primary} />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="grid-view" size={24} color={COLORS.lightText} />
          <Text style={styles.navText}>Quizzes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="people" size={24} color={COLORS.lightText} />
          <Text style={styles.navText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color={COLORS.lightText} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'Montserrat Alternates Regular',
  },
  notificationIcon: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  activitySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    fontFamily: 'Montserrat Alternates Regular',
  },
  activityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 8,
  },
  activityTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  activityDuration: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inspirationSection: {
    marginBottom: 24,
  },
  inspirationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inspirationText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  quickContentSection: {
    marginBottom: 24,
  },
  quickContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickCardBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  quickCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  quickCardContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  quickCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  quickCardDuration: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
  },
  playIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 4,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '30%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: COLORS.pink,
  },
  statContent: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  challengesSection: {
    marginBottom: 24,
  },
  challengesGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  challengeCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  challengeIconContainer: {
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 16,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  startButtonText: {
    fontSize: 14,
    color: COLORS.text,
    marginRight: 4,
  },
  recommendedSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  recommendedScrollView: {
    marginTop: 12,
  },
  articleCard: {
    width: 280,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  articleImage: {
    width: '100%',
    height: 160,
  },
  articleContent: {
    padding: 16,
  },
  articleType: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleDuration: {
    fontSize: 12,
    color: COLORS.lightText,
    marginLeft: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.pink,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 4,
  },
  activeNavText: {
    color: COLORS.primary,
  },
  lottieContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  preferencesModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  preferencesModalContent: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  preferencesModalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Montserrat Alternates Regular",
  },
  preferencesModalQuestion: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: "Montserrat Alternates Regular",
  },
  preferencesModalOptions: {
    width: "100%",
    gap: 12,
    marginBottom: 20,
    position: 'relative',
  },
  preferencesModalOption: {
    backgroundColor: COLORS.pink,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    transform: [{ scale: 1 }],
    position: 'relative',
    overflow: 'hidden',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.accent,
    transform: [{ scale: 1.02 }],
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  optionFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
  },
  progressIndicator: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lightText,
    opacity: 0.3,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    opacity: 1,
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: COLORS.green,
    opacity: 0.7,
    width: 8,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 12,
  },
  descriptionDrawer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    fontFamily: 'Montserrat Alternates Regular',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'Montserrat Alternates Regular',
  },
});

export default MainContent;