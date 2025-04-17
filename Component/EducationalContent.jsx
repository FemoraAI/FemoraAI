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
  Dimensions,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ArticleModal from "./modal/Articlemodal";
import LottieView from "lottie-react-native";
import sunAnimation from '../assets/animations/sun.json';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

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
  meditationCardBg1: '#FFE0E6',
  meditationCardBg2: '#FFD1DC',
  meditationAction: '#8E97FD',
  meditationActionBg: 'rgba(142, 151, 253, 0.1)',
  meditationTagText: '#8E97FD',
  meditationTagBg: 'rgba(142, 151, 253, 0.1)',
  personalizedHeaderBg: 'rgba(142, 151, 253, 0.05)',
  personalizedTagBg: 'rgba(142, 151, 253, 0.1)',
};

const { width } = Dimensions.get('window');

const mockUserData = {
  cyclePhase: 'follicular',
  symptoms: ['headache', 'fatigue', 'mood swings', 'cramps'],
  mood: 'anxious',
  flow: 'medium',
  stressLevel: 7,
  sleepQuality: 6,
  energyLevel: 5,
  healthConditions: ['PCOS'],
  inProgressMeditations: [
    {
      id: 101,
      title: 'Stress Relief',
      description: 'Calm your mind and reduce anxiety',
      duration: '15 Minutes',
      progress: 0.3,
      image: require('../assets/meditate1.jpg'),
      audioUrl: 'https://example.com/stress-relief.mp3',
      tags: ['stress', 'anxiety'],
      lastAccessed: '2024-03-15T10:30:00',
    }
  ],
  previousMeditations: [
    {
      id: 201,
      title: 'Sleep Better',
      description: 'Improve your sleep quality',
      duration: '20 Minutes',
      progress: 0.7,
      image: require('../assets/meditate2.jpg'),
      audioUrl: 'https://example.com/sleep-better.mp3',
      tags: ['sleep', 'relaxation'],
      lastAccessed: '2024-03-10T22:00:00',
    }
  ]
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
    title: "Managing Anxiety During Your Day",
    subtitle: "Calming Techniques for Anxious Moments",
    recommendedBy: "Dr. Sarah Wilson",
    content: "Feeling anxious? Explore practical tips and mindfulness techniques to find calm and manage anxiety symptoms effectively.",
    readTime: "5 min read",
    type: "Mental Health",
    image: "https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ['anxiety', 'mood', 'stress'],
  },
  {
    id: 2,
    title: "Mindful Living for Stress",
    subtitle: "Daily Practices for Peace",
    recommendedBy: "Dr. Michael Chang",
    content: "Learn how to incorporate mindful practices into your daily routine for a more balanced and peaceful life, reducing stress.",
    readTime: "7 min read",
    type: "Mindfulness",
    image: "https://images.pexels.com/photos/7176027/pexels-photo-7176027.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ['stress', 'anxiety', 'mood swings'],
  },
  {
    id: 3,
    title: "Fighting Fatigue & Boosting Low Energy",
    subtitle: "Lifestyle Strategies for Feeling More Vibrant",
    recommendedBy: "Dr. Emily Brooks",
    content: "Struggling with fatigue and low energy? Discover simple diet, exercise, and sleep habits to naturally increase your vitality.",
    readTime: "6 min read",
    type: "Lifestyle",
    image: "https://cdn.pixabay.com/photo/2022/11/08/09/31/background-7578102_1280.jpg",
    tags: ['fatigue', 'energyLevel', 'sleepQuality'],
  },
  {
    id: 4,
    title: "Easing Menstrual Cramps",
    subtitle: "Natural Remedies for Period Pain",
    recommendedBy: "Dr. Jessica Chen",
    content: "Find effective, natural ways to manage menstrual cramps and discomfort during your cycle.",
    readTime: "4 min read",
    type: "Women's Health",
    image: "https://media.istockphoto.com/id/961365406/photo/woman-with-hot-water-bottle-healing-stomach-pain.jpg?s=612x612&w=0&k=20&c=JMAIGd7A2bmPngrOopJgpwtsMeaJ7bdZQqkvUYbAxIM=",
    tags: ['cramps', 'cyclePhase', 'symptoms'],
  },
  {
    id: 5,
    title: "Living Well with PCOS",
    subtitle: "Understanding and Managing Symptoms",
    recommendedBy: "Dr. Olivia Green",
    content: "A comprehensive guide to understanding PCOS, managing symptoms like fatigue and mood swings, and improving overall well-being.",
    readTime: "8 min read",
    type: "Health Condition",
    image: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ['PCOS', 'healthConditions', 'fatigue', 'mood swings'],
  },
  {
    id: 6,
    title: "Strategies for Better Sleep",
    subtitle: "Improve Your Sleep Quality Tonight",
    recommendedBy: "Dr. Ben Carter",
    content: "Learn practical techniques and lifestyle adjustments to help you fall asleep faster and enjoy more restorative sleep.",
    readTime: "7 min read",
    type: "Sleep",
    image: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ['sleepQuality', 'fatigue', 'stress'],
  },
  {
    id: 7,
    title: "Nutrition for Your Cycle: Follicular Phase",
    subtitle: "Foods to Support Energy and Mood",
    recommendedBy: "Nutritionist Laura Miles",
    content: "Discover the best foods to eat during your follicular phase to boost energy, stabilize mood, and support hormonal balance.",
    readTime: "5 min read",
    type: "Nutrition",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ['cyclePhase', 'follicular', 'nutrition', 'energyLevel'],
  },
  {
    id: 8,
    title: "Coping with Headaches",
    subtitle: "Tips for Managing Headache Pain",
    recommendedBy: "Dr. Ken Adams",
    content: "Explore various strategies, from relaxation techniques to identifying triggers, to help manage and reduce headache frequency.",
    readTime: "6 min read",
    type: "Symptom Management",
    image: "https://images.pexels.com/photos/3807767/pexels-photo-3807767.jpeg?auto=compress&cs=tinysrgb&w=600",
    tags: ['headache', 'symptoms', 'stress'],
  }
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
  const navigation = useNavigation();

  const [userData, setUserData] = useState(mockUserData);
  const [isFavorite, setIsFavorite] = useState(false);
  const [scrollX] = useState(new Animated.Value(0));
  const [cardScale] = useState(new Animated.Value(1));
  const [cardOpacity] = useState(new Animated.Value(1));
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState([]);

  const fetchUserData = async () => {
    setUserData(mockUserData);
    checkPreferences();
  };

  useEffect(() => {
    fetchUserData();
    const checkPreferences = async () => {
      const hasCompleted = await AsyncStorage.getItem("hasCompletedPreferences");
      if (!hasCompleted) {
        setUserPreferencesModalVisible(true);
      }
    };
    checkPreferences();
  }, []);

  useEffect(() => {
    if (userData) {
      const userTags = [
        userData.cyclePhase,
        userData.mood,
        ...(userData.symptoms || []),
        ...(userData.healthConditions || []),
        userData.stressLevel > 6 ? 'stress' : null,
        userData.sleepQuality < 7 ? 'sleepQuality' : null,
        userData.energyLevel < 6 ? 'energyLevel' : null,
      ].filter(tag => tag !== null).map(tag => String(tag).toLowerCase());

      const relevantArticles = recommendedArticles.filter(article => {
        const articleTagsLower = article.tags.map(tag => String(tag).toLowerCase());
        return articleTagsLower.some(articleTag => userTags.includes(articleTag));
      });
      setFilteredArticles(relevantArticles);
    } else {
      setFilteredArticles(recommendedArticles);
    }
  }, [userData]);

  const getPersonalizedMeditations = () => {
    const { cyclePhase, symptoms, mood, stressLevel, healthConditions } = userData;
    let meditations = [];
    if (mood === 'anxious') {
      meditations.push({
        id: 1, title: 'Anxiety Relief', description: 'Find peace in moments of anxiety', duration: '10 Min', image: require('../assets/meditate4.jpg'), audioUrl: '', tags: ['anxiety', 'calm'], type: 'mood',
      });
    }
    if (userData.sleepQuality < 7) {
      meditations.push({
        id: 2, title: 'Deep Sleep', description: 'Improve your sleep quality', duration: '20 Min', image: require('../assets/meditate2.jpg'), audioUrl: '', tags: ['sleep', 'relaxation'], type: 'sleep',
      });
    }
    if (cyclePhase === 'menstrual') {
      meditations.push({
        id: 3, title: 'Period Comfort', description: 'Ease menstrual discomfort', duration: '15 Min', image: require('../assets/meditate3.jpg'), audioUrl: '', tags: ['menstrual', 'comfort'], type: 'cycle',
      });
    }
    if (symptoms.includes('cramps')) {
      meditations.push({
        id: 4, title: 'Cramp Relief', description: 'Gentle meditation for cramps', duration: '12 Min', image: require('../assets/meditate1.jpg'), audioUrl: '', tags: ['cramps', 'comfort'], type: 'symptoms',
      });
    }
    if (healthConditions.includes('PCOS')) {
      meditations.push({
        id: 5, title: 'PCOS Support', description: 'Meditation for hormonal balance', duration: '15 Min', image: require('../assets/meditate2.jpg'), audioUrl: '', tags: ['PCOS', 'hormonal'], type: 'health',
      });
    }
    return meditations;
  };

  const animateCardPress = (scale) => {
    Animated.parallel([
      Animated.spring(cardScale, { toValue: scale, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(cardOpacity, { toValue: scale === 0.95 ? 0.8 : 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleMeditationSelect = (meditation) => {
    animateCardPress(0.95);
    setTimeout(() => {
      animateCardPress(1);
      console.log("Selected meditation:", meditation.title);
      Alert.alert("Navigate", `Would navigate to ${meditation.title}`);
    }, 200);
  };

  const renderMeditationCard = (meditation, index) => (
    <Animated.View
      key={meditation.id}
      style={[ styles.meditationCard, { transform: [{ scale: cardScale }], opacity: cardOpacity } ]}
    >
      <TouchableOpacity
        onPress={() => handleMeditationSelect(meditation)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[COLORS.meditationCardBg1, COLORS.meditationCardBg2]}
          style={styles.meditationGradient}
        >
          <Image source={meditation.image} style={styles.meditationImage} />
          <View style={styles.meditationInfo}>
            <Text style={styles.meditationTitle}>{meditation.title}</Text>
            <Text style={styles.meditationDescription}>{meditation.description}</Text>
            <View style={styles.meditationMeta}>
              <Text style={styles.meditationDuration}>{meditation.duration}</Text>
              <View style={styles.meditationTags}>
                {meditation.tags.map((tag, tagIndex) => (
                  <View key={tagIndex} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const closeModal = () => {
    setModalVisible(false);
    setSelectedArticle(null);
  };

  const handleArticlePress = (article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const optionDescriptions = {
    "Vegetarian 🥗": "Leaf-ing the meat behind! Your superpower is turning plants into pure deliciousness.",
    "Non-Vegetarian 🥩": "The ultimate food explorer! No dish is too adventurous for your taste buds.",
    "Vegan 🌱": "Plant-based warrior! Saving the planet one tofu block at a time.",
    "Flexitarian 🥑": "Best of both worlds! You're like a dietary chameleon, adapting with style.",
    "Morning Bird 🌄": "Early bird gets the worm... and probably all the hot coffee too!",
    "Afternoon Power ⭐️": "Lunch hour superhero! Your energy peaks when others are food-coma-ing.",
    "Night Spirit 🌌": "Moonlight's bestie! While others snooze, you're in your groove.",
    "Random Bursts ✨": "You're like a surprise party - nobody knows when you'll pop up with energy!",
    "Sleeping like a baby 👶": "Plot twist: Actually sleeping through the night, unlike real babies!",
    "Decent ZZZs 💤": "Not all heroes wear capes, some just have a consistent bedtime.",
    "Tossing & turning 🔄": "Your bed is basically a salad spinner - everything's mixed up!",
    "What is sleep? 🤔": "Coffee is your love language, and insomnia is your sidekick.",
  };

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
      options: ["Gym Partner 🏋️‍♀️", "Meditation Guru 🧘‍♂️", "Party Friend 🎉", "Nature Explorer 🏞️"],
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
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
        
        <View style={styles.sunAnimationContainer}>
          <LottieView
            source={sunAnimation}
            autoPlay
            loop
            style={styles.sunAnimation}
          />
        </View>

        <View style={styles.personalizedSectionContainer}>
          <View style={styles.personalizedHeader}>
            <Text style={styles.personalizedTitle}>Personalized for You</Text>
            <Text style={styles.personalizedSubtitle}>
              Based on your current symptoms, cycle phase, and mood
            </Text>
            <View style={styles.personalizedTags}>
              <View style={styles.personalizedTag}>
                <Text style={styles.personalizedTagText}>{userData.cyclePhase}</Text>
          </View>
              <View style={styles.personalizedTag}>
                <Text style={styles.personalizedTagText}>{userData.mood}</Text>
        </View>
              {userData.symptoms.map((symptom, index) => (
                <View key={index} style={styles.personalizedTag}>
                  <Text style={styles.personalizedTagText}>{symptom}</Text>
                </View>
            ))}
          </View>
        </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personalised Meditation and Yoga</Text>
              </View>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.meditationsContainer}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            >
              {getPersonalizedMeditations().length > 0 ? (
                getPersonalizedMeditations().map((meditation, index) =>
                  renderMeditationCard(meditation, index)
                )
              ) : (
                <Text style={styles.noRecommendationsText}>No specific recommendations right now. Explore general meditations!</Text>
              )}
            </Animated.ScrollView>
          </View>
        </View>

        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Articles</Text>
            {filteredArticles.length > 4 && !showAllArticles && (
              <TouchableOpacity onPress={() => setShowAllArticles(true)}>
                <Text style={styles.viewAllText}>See all ({filteredArticles.length})</Text>
            </TouchableOpacity>
            )}
          </View>
          <View style={styles.articlesContainer}>
            {(showAllArticles ? filteredArticles : filteredArticles.slice(0, 4)).map((article) => (
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
            {filteredArticles.length === 0 && (
              <Text style={styles.noRecommendationsText}>No specific articles match your current profile. Explore all content!</Text>
            )}
        </View>
        </View>

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

      {renderUserPreferencesModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
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
  sunAnimationContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -30,
  },
  sunAnimation: {
    width: 400,
    height: 400,
  },
  personalizedSectionContainer: {
    marginBottom: 10,
  },
  personalizedHeader: {
    backgroundColor: COLORS.personalizedHeaderBg,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
  },
  personalizedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'PlayfairDisplay-SemiBold',
    marginBottom: 8,
  },
  personalizedSubtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  personalizedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  personalizedTag: {
    backgroundColor: COLORS.personalizedTagBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  personalizedTagText: {
    fontSize: 12,
    color: COLORS.meditationTagText,
    fontFamily: 'Poppins-Medium',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    fontFamily: 'Poppins-SemiBold',
  },
  viewAllText: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: 'Poppins-SemiBold',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  meditationsContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 10,
  },
  meditationCard: {
    width: width * 0.65,
    marginRight: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  meditationGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  meditationImage: {
    width: '100%',
    height: width * 0.4,
  },
  meditationInfo: {
    padding: 12,
  },
  meditationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  meditationDescription: {
    fontSize: 13,
    color: COLORS.lightText,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    lineHeight: 17,
  },
  meditationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  meditationDuration: {
    fontSize: 11,
    color: COLORS.lightText,
    marginRight: 10,
    fontFamily: 'Poppins-Regular',
  },
  meditationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.meditationTagText,
    fontFamily: 'Poppins-Medium',
  },
  noRecommendationsText: {
    marginLeft: 16,
    color: COLORS.lightText,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  recommendedSection: {
    marginBottom: 80,
  },
  articlesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 16,
  },
  articleCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  articleImage: {
    width: "100%",
    height: 130,
    backgroundColor: COLORS.pink,
  },
  articleContent: {
    padding: 12,
  },
  articleType: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: COLORS.meditationTagText,
    backgroundColor: COLORS.meditationTagBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
    overflow: "hidden",
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  articleFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  articleDuration: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: COLORS.lightText,
    marginLeft: 4,
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
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.pink,
    borderRadius: 4,
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: COLORS.pink,
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: 'Poppins-Medium',
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: COLORS.pink,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOptionButton: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF0F5',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    fontFamily: 'Poppins-Regular',
  },
  optionDescription: {
    fontSize: 13,
    color: COLORS.lightText,
    textAlign: "center",
    marginTop: 10,
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },
  modalNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  processingButton: {
    backgroundColor: COLORS.secondary,
  },
  processingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  drawerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  drawerContent: {
    // Styles for drawer content
  },
  drawerHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.lightText,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default MainContent;