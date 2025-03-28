import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  Pressable,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Asset } from 'expo-asset';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  where,
  increment
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useUser } from './context/UserContext';

// Dummy data for posts
const dummyPosts = [
  {
    id: 1,
    title: "Living with PCOS - My Journey",
    author: "Sarah M.",
    category: "PCOS",
    content: "After being diagnosed with PCOS last year, I've learned so much about managing symptoms naturally. Regular exercise, especially yoga and strength training, has made a huge difference. I've also found that maintaining a consistent sleep schedule helps regulate my hormones.",
    likes: 45,
    comments: 12,
    isPinned: true,
    isAnonymous: false,
    timestamp: "2h ago",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Period Pain Relief Tips",
    author: "Anonymous",
    category: "Period Health",
    content: "I've discovered some amazing natural remedies for menstrual cramps. Warm compress, ginger tea, and gentle stretching exercises have been game-changers. Also, avoiding caffeine during my period has significantly reduced pain.",
    likes: 32,
    comments: 8,
    isPinned: false,
    isAnonymous: true,
    timestamp: "4h ago",
    image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Mental Health During PMS",
    author: "Emma L.",
    category: "Mental Wellness",
    content: "Let's talk about managing anxiety and mood swings during PMS. I've found meditation and journaling to be incredibly helpful. Creating a self-care routine specifically for PMS week has made a huge difference.",
    likes: 67,
    comments: 23,
    isPinned: true,
    isAnonymous: false,
    timestamp: "1d ago",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Pregnancy Journey - First Trimester",
    author: "Lisa R.",
    category: "Pregnancy",
    content: "Currently 12 weeks pregnant and wanted to share my experience. Morning sickness has been challenging, but I've found some great coping strategies. Small, frequent meals and ginger candies have been lifesavers!",
    likes: 89,
    comments: 34,
    isPinned: false,
    isAnonymous: false,
    timestamp: "2d ago",
    image: "https://images.unsplash.com/photo-1584559582128-b8be739912e1?w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Sexual Health Awareness",
    author: "Dr. Jennifer",
    category: "Sexual Wellness",
    content: "Important reminder about regular check-ups and understanding your body. Prevention is better than cure. Let's discuss the importance of regular screenings and maintaining open communication with healthcare providers.",
    likes: 56,
    comments: 15,
    isPinned: false,
    isAnonymous: false,
    timestamp: "3d ago",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Endometriosis Support Group",
    author: "Anonymous",
    category: "Period Health",
    content: "Looking to connect with others who have endometriosis. It's been a challenging journey, and I'd love to share experiences and support each other. What treatments have worked for you?",
    likes: 78,
    comments: 45,
    isPinned: false,
    isAnonymous: true,
    timestamp: "4d ago",
    image: "https://images.unsplash.com/photo-1573739022854-abceaeb585dc?w=800&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Relationship Advice Needed",
    author: "Anonymous",
    category: "Spicy",
    content: "Looking for advice on spicing up my relationship. What are some romantic date night ideas that have worked for you?",
    likes: 42,
    comments: 15,
    isPinned: false,
    isAnonymous: true,
    timestamp: "5h ago",
    image: null
  }
];

// Categories with enhanced icons and descriptions
const categories = [
  { 
    id: 1, 
    name: "All", 
    icon: "apps",
    description: "View all topics"
  },
  { 
    id: 2, 
    name: "My Posts", 
    icon: "person", // Using person icon for My Posts
    description: "View your posts"
  },
  { 
    id: 3, 
    name: "Spicy", 
    icon: "whatshot",
    description: "Adult content & intimate discussions"
  },
  { 
    id: 4, 
    name: "Period Health", 
    icon: "favorite",
    description: "Menstrual wellness & tips"
  },
  { 
    id: 5, 
    name: "PCOS", 
    icon: "medical-services",
    description: "PCOS support & management"
  },
  { 
    id: 6, 
    name: "Mental Wellness", 
    icon: "psychology",
    description: "Mental health & support"
  },
  { 
    id: 7, 
    name: "Sexual Wellness", 
    icon: "spa",
    description: "Sexual health discussions"
  },
];

// Add this constant at the top level of your file after imports
const profileImages = [
  require('../assets/profile/bear.png'),
  require('../assets/profile/cat.png'),
  require('../assets/profile/deer.png'),
  require('../assets/profile/giraffe.png'),
  require('../assets/profile/meerkat.png'),
    require('../assets/profile/owl.png'),
  require('../assets/profile/panda.png'),
    require('../assets/profile/sloth.png'),

    require('../assets/profile/penguin.png'),


  // Add all your profile images here
];

const profileImageCache = new Map();

const getRandomProfileImage = (id) => {
  if (profileImageCache.has(id)) {
    return profileImageCache.get(id);
  }
  const randomImage = profileImages[Math.floor(Math.random() * profileImages.length)];
  profileImageCache.set(id, randomImage);
  return randomImage;
};

// Sort Modal implementation
const SortModal = ({ visible, onClose, sortBy, setSortBy }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
          <View style={styles.sortModalContent}>
            <View style={styles.sortOptions}>
              <TouchableOpacity
                style={[styles.sortOption, sortBy === 'hot' && styles.sortOptionActive]}
                onPress={() => {
                  setSortBy('hot');
                  onClose();
                }}
              >
                <MaterialIcons name="whatshot" size={24} color={sortBy === 'hot' ? "#FF85A2" : "#8F90A6"} />
                <Text style={[styles.sortOptionText, sortBy === 'hot' && styles.sortOptionTextActive]}>Hot</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortOption, sortBy === 'new' && styles.sortOptionActive]}
                onPress={() => {
                  setSortBy('new');
                  onClose();
                }}
              >
                <MaterialIcons name="schedule" size={24} color={sortBy === 'new' ? "#FF85A2" : "#8F90A6"} />
                <Text style={[styles.sortOptionText, sortBy === 'new' && styles.sortOptionTextActive]}>New</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortOption, sortBy === 'top' && styles.sortOptionActive]}
                onPress={() => {
                  setSortBy('top');
                  onClose();
                }}
              >
                <MaterialIcons name="trending-up" size={24} color={sortBy === 'top' ? "#FF85A2" : "#8F90A6"} />
                <Text style={[styles.sortOptionText, sortBy === 'top' && styles.sortOptionTextActive]}>Top</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

// Welcome Modal Component
const WelcomeModal = ({ visible, onClose, animation }) => {
  const giftScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.delay(800),
        Animated.spring(giftScale, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.welcomeModalOverlay}>
        <Animated.View 
          style={[
            styles.welcomeModalContent,
            {
              transform: [{ scale: animation }]
            }
          ]}
        >
          <Animated.View style={[
            styles.giftContainer,
            {
              transform: [{ scale: giftScale }]
            }
          ]}>
            <MaterialIcons name="volunteer-activism" size={48} color="#FF85A2" />
          </Animated.View>
          <Text style={styles.welcomeTitle}>Welcome to Our Community! 💕</Text>
          <Text style={styles.welcomeDescription}>
            Join a supportive space where women empower each other. Share experiences, find support, and grow together.
          </Text>
          <View style={styles.guidelineContainer}>
            <Text style={styles.guidelineTitle}>Community Guidelines:</Text>
            <Text style={styles.guidelineText}>• Be respectful and supportive</Text>
            <Text style={styles.guidelineText}>• Protect your privacy</Text>
            <Text style={styles.guidelineText}>• Share experiences, not medical advice</Text>
            <Text style={styles.guidelineText}>• Report inappropriate content</Text>
          </View>
          <TouchableOpacity
            style={styles.welcomeButton}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onClose();
            }}
          >
            <Text style={styles.welcomeButtonText}>Join the Community!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

// New Post Modal Component
const NewPostModal = ({ visible, onClose, onPost }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { userData } = useUser();

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const handlePost = async () => {
    try {
      const newPost = {
        title: postTitle,
        content: postContent,
        category: selectedCategory || "General",
        image: imagePreview,
        timestamp: serverTimestamp(),
        likes: 0,
        comments: 0,
        userId: userData.uid,
        author: "Anonymous",
        isAnonymous: true,
      };
      
      await addDoc(collection(db, 'posts'), newPost);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onPost(newPost);
      setPostTitle('');
      setPostContent('');
      setSelectedCategory('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setImagePreview(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.newPostModalOverlay}
      >
        <Animated.View 
          style={[
            styles.newPostModalContent,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.newPostHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#8F90A6" />
            </TouchableOpacity>
            <Text style={styles.newPostTitle}>Create Post</Text>
            <TouchableOpacity 
              style={[styles.postButton, !postTitle || !postContent ? styles.postButtonDisabled : null]}
              onPress={handlePost}
              disabled={!postTitle || !postContent}
            >
              <Text style={[styles.postButtonText, !postTitle || !postContent ? styles.postButtonTextDisabled : null]}>
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.newPostForm} 
            bounces={false}
            contentContainerStyle={styles.newPostFormContent}
          >
            <View style={styles.formSection}>
              <TextInput
                style={styles.titleInput}
                placeholder="Write an engaging title..."
                placeholderTextColor="#B4B4BE"
                value={postTitle}
                onChangeText={setPostTitle}
                maxLength={100}
              />

              <TextInput
                style={styles.contentInput}
                placeholder="Share your thoughts, experiences, or ask for advice..."
                placeholderTextColor="#B4B4BE"
                value={postContent}
                onChangeText={setPostContent}
                multiline
                textAlignVertical="top"
              />

              <View style={styles.imageContainer}>
                {imagePreview && (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: imagePreview }} 
                      style={styles.imagePreview}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <MaterialIcons name="close" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleImagePick}
                >
                  <MaterialIcons name="add-photo-alternate" size={24} color="#FF85A2" />
                  <Text style={styles.addImageText}>Add Image</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.categorySelector}>
              <Text style={styles.selectorLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.filter(category => category.name !== "My Posts" && category.name !== "All").map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category.name && styles.categoryChipActive
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.name);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <MaterialIcons
                      name={category.icon}
                      size={20}
                      color={selectedCategory === category.name ? "#FF85A2" : "#8F90A6"}
                    />
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategory === category.name && styles.categoryChipTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const EditPostModal = ({ visible, onClose, onEdit, post }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { userData } = useUser();

  useEffect(() => {
    if (visible) {
      setPostTitle(post.title);
      setPostContent(post.content);
      setSelectedCategory(post.category);
      setImagePreview(post.image);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, post]);

  const handleEditSubmit = async () => {
    try {
      const editedPost = {
        title: postTitle,
        content: postContent,
        category: selectedCategory || post.category,
        image: imagePreview,
        isAnonymous: true,
        author: "Anonymous",
        lastEdited: serverTimestamp()
      };
      
      await updateDoc(doc(db, 'posts', post.id), editedPost);
      onEdit(editedPost);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setImagePreview(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.newPostModalOverlay}
      >
        <Animated.View 
          style={[
            styles.newPostModalContent,
            {
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.newPostHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#8F90A6" />
            </TouchableOpacity>
            <Text style={styles.newPostTitle}>Edit Post</Text>
            <TouchableOpacity 
              style={[styles.postButton, !postTitle || !postContent ? styles.postButtonDisabled : null]}
              onPress={handleEditSubmit}
              disabled={!postTitle || !postContent}
            >
              <Text style={[styles.postButtonText, !postTitle || !postContent ? styles.postButtonTextDisabled : null]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.newPostForm}
            bounces={false}
            contentContainerStyle={styles.newPostFormContent}
          >
            <View style={styles.formSection}>
              <TextInput
                style={styles.titleInput}
                placeholder="Write an engaging title..."
                placeholderTextColor="#B4B4BE"
                value={postTitle}
                onChangeText={setPostTitle}
                maxLength={100}
              />

              <TextInput
                style={styles.contentInput}
                placeholder="Share your thoughts, experiences, or ask for advice..."
                placeholderTextColor="#B4B4BE"
                value={postContent}
                onChangeText={setPostContent}
                multiline
                textAlignVertical="top"
              />

              <View style={styles.imageContainer}>
                {imagePreview && (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: imagePreview }} 
                      style={styles.imagePreview}
                      resizeMode="cover"
                    />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <MaterialIcons name="close" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleImagePick}
                >
                  <MaterialIcons name="add-photo-alternate" size={24} color="#FF85A2" />
                  <Text style={styles.addImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.categorySelector}>
              <Text style={styles.selectorLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.filter(category => category.name !== "My Posts" && category.name !== "All").map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category.name && styles.categoryChipActive
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.name);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <MaterialIcons
                      name={category.icon}
                      size={20}
                      color={selectedCategory === category.name ? "#FF85A2" : "#8F90A6"}
                    />
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategory === category.name && styles.categoryChipTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const ReactionAnimation = ({ emoji, onComplete }) => {
  const animatedValues = useRef([...Array(6)].map(() => new Animated.Value(0))).current;
  
  useEffect(() => {
    const animations = animatedValues.map((value, index) => {
      return Animated.sequence([
        Animated.delay(index * 50),
        Animated.parallel([
          Animated.timing(value, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true
          }),
          Animated.sequence([
            Animated.delay(200),
            Animated.timing(value, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true
            })
          ])
        ])
      ]);
    });

    Animated.stagger(50, animations).start(() => {
      if (onComplete) onComplete();
    });
  }, []);

  return (
    <>
      {animatedValues.map((value, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.floatingEmoji,
            {
              transform: [
                {
                  translateY: value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100]
                  })
                },
                {
                  scale: value.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.5, 0]
                  })
                }
              ],
              opacity: value
            }
          ]}
        >
          {emoji}
        </Animated.Text>
      ))}
    </>
  );
};

const CommentModal = ({ visible, onClose, postId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      Animated.spring(modalAnimation, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || !postId) return;

    const commentsQuery = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString() || 'Just now'
      }));
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [visible, postId]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    
    try {
      const newComment = {
        text: comment,
        author: "Anonymous",
        timestamp: serverTimestamp(),
        likes: 0,
        isLiked: false,
        replyTo: replyTo?.id || null
      };
      
      await addDoc(collection(db, 'posts', postId, 'comments'), newComment);
      
      // Update comment count in the post
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: increment(1)
      });

      setComment('');
      setReplyTo(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = (commentId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    setComment(`@${comment.author} `);
    inputRef.current?.focus();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderComment = ({ item }) => (
    <Animated.View 
      style={[
        styles.commentItem,
        item.replyTo && styles.replyComment
      ]}
      entering={Animated.spring({
        duration: 300,
        damping: 12,
        stiffness: 100
      })}
    >
      <Image 
        source={getRandomProfileImage(item.id)}
        style={styles.commentAvatar} 
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentAuthor}>{item.author}</Text>
          <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.commentAction}
            onPress={() => handleLikeComment(item.id)}
          >
            <MaterialIcons 
              name={item.isLiked ? "favorite" : "favorite-border"} 
              size={16} 
              color={item.isLiked ? "#FF85A2" : "#8F90A6"} 
            />
            <Text style={[
              styles.actionText,
              item.isLiked && styles.actionTextActive
            ]}>
              {item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.commentAction}
            onPress={() => handleReply(item)}
          >
            <MaterialIcons name="reply" size={16} color="#8F90A6" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.commentModalOverlay}
      >
        <Animated.View 
          style={[styles.commentModalContent]}
        >
          <View style={styles.commentHeader}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#8F90A6" />
            </TouchableOpacity>
            <Text style={styles.commentTitle}>Comments</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.commentInputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.commentInput}
              placeholder="Write a comment..."
              placeholderTextColor="#B4B4BE"
              value={comment}
              onChangeText={setComment}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !comment.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!comment.trim() || isSubmitting}
            >
              <MaterialIcons 
                name="send" 
                size={24} 
                color={comment.trim() ? "#FF85A2" : "#8F90A6"} 
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.commentsList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const PostItem = React.memo(({ item, index, scrollY, likedPosts, handleLike, setPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });
  const likeAnimation = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(null);
  const { userData } = useUser();

  const isUserPost = item.userId === userData.uid;

  const handleDoubleTap = (event) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
      if (!likedPosts[item.id]) {
        // Get tap coordinates
        setHeartPosition({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY
        });
        
        // Show and animate the heart
        setShowHeartAnimation(true);
        Animated.sequence([
          Animated.parallel([
            Animated.spring(heartScale, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true
            }),
            Animated.spring(heartOpacity, {
              toValue: 1,
              friction: 3,
              useNativeDriver: true
            })
          ]),
          Animated.delay(200),
          Animated.parallel([
            Animated.timing(heartScale, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true
            }),
            Animated.timing(heartOpacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true
            })
          ])
        ]).start(() => {
          setShowHeartAnimation(false);
          heartScale.setValue(0);
          heartOpacity.setValue(0);
        });

        handleLike(item.id);
        Animated.sequence([
          Animated.timing(likeAnimation, {
            toValue: 1.5,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(likeAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
          })
        ]).start();
      }
    }
    lastTap.current = now;
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'posts', item.id));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (editedPost) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === item.id ? { ...post, ...editedPost } : post
    ));
    setShowEditModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <Animated.View
      style={[
        styles.postCard,
        {
          transform: [
            {
              translateY: scrollY.interpolate({
                inputRange: [-50, 0, (index * 300), ((index + 1) * 300)],
                outputRange: [0, 0, 0, 0],
                extrapolate: 'clamp'
              })
            }
          ]
        }
      ]}
    >
      <TouchableOpacity 
        activeOpacity={1}
        onPress={(event) => handleDoubleTap(event)}
        style={{ flex: 1 }}
      >
        {showHeartAnimation && (
          <Animated.View
            style={[
              styles.heartAnimationContainer,
              {
                left: heartPosition.x - 50,
                top: heartPosition.y - 25,
                transform: [{ scale: heartScale }],
                opacity: heartOpacity
              }
            ]}
          >
            <MaterialIcons name="favorite" size={100} color="#FF85A2" />
          </Animated.View>
        )}
        <View style={styles.postHeader}>
          <View style={styles.authorContainer}>
            {item.isAnonymous ? (
              <Image
                source={getRandomProfileImage(item.id)}
                style={styles.authorAvatar}
              />
            ) : (
              <MaterialIcons name="person-outline" size={24} color="#8F90A6" />
            )}
            <View>
              <Text style={styles.authorName}>{item.author}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent}>{item.content}</Text>

        {item.image && (
          <View style={styles.postImageContainer}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.postFooter}>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => handleLike(item.id)}
          >
            <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
              <MaterialIcons 
                name={likedPosts[item.id] ? "favorite" : "favorite-border"} 
                size={24} 
                color={likedPosts[item.id] ? "#FF85A2" : "#8F90A6"} 
              />
            </Animated.View>
            <Text style={[styles.footerButtonText, likedPosts[item.id] && styles.footerButtonTextActive]}>
              {item.likes}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => setShowComments(true)}
          >
            <MaterialIcons name="chat-bubble-outline" size={20} color="#8F90A6" />
            <Text style={styles.footerButtonText}>{item.comments}</Text>
          </TouchableOpacity>

          {isUserPost && (
            <>
              <TouchableOpacity 
                style={[styles.footerButton, { marginLeft: 'auto' }]}
                onPress={() => setShowEditModal(true)}
              >
                <MaterialIcons name="edit" size={20} color="#999aa8" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.footerButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <MaterialIcons name="delete" size={20} color="#999aa8" />
              </TouchableOpacity>
            </>
          )}
        </View>

        <CommentModal
          visible={showComments}
          onClose={() => setShowComments(false)}
          postId={item.id}
        />

        <EditPostModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onEdit={handleEdit}
          post={item}
        />
      </TouchableOpacity>
    </Animated.View>
  );
});

const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  
  const now = new Date();
  const date = timestamp.toDate();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? 's' : ''} ago`;
};

const Community = () => {
  const insets = useSafeAreaInsets();
  const { userData } = useUser();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [sortBy, setSortBy] = useState('hot');
  const [showSortModal, setShowSortModal] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [posts, setPosts] = useState(dummyPosts);
  const [joinedCommunities, setJoinedCommunities] = useState(new Set(['All']));
  const welcomeAnimation = useRef(new Animated.Value(0)).current;
  const giftAnimation = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = useRef(new Animated.Value(Platform.OS === 'ios' ? 90 : 70)).current;
  const categoryScrollX = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);

  // Header animations
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.98],
    extrapolate: 'clamp'
  });

  // Set up real-time listener for posts
  useEffect(() => {
    const postsQuery = query(
      collection(db, 'posts'), 
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: getTimeAgo(doc.data().timestamp),
        author: "Anonymous", // Always show as Anonymous in frontend
        isAnonymous: true
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Modify handleLike function to update Firebase
  const handleLike = useCallback(async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const newLikeStatus = !likedPosts[postId];
      
      await updateDoc(postRef, {
        likes: newLikeStatus ? increment(1) : increment(-1)
      });

      setLikedPosts(prev => ({
        ...prev,
        [postId]: newLikeStatus
      }));
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  }, [likedPosts]);

  // Scroll haptics handler
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  // Category/Community animations
  const renderCategory = useCallback(({ item }) => {
    const isJoined = joinedCommunities.has(item.name);
    return (
      <TouchableOpacity
        key={item.id.toString()}
        style={[
          styles.communityButton,
          selectedCategory === item.name && styles.communityButtonActive,
        ]}
        onPress={() => {
          setSelectedCategory(item.name);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
      >
        <View style={styles.communityIconContainer}>
          <MaterialIcons
            name={item.icon}
            size={20}
            color={selectedCategory === item.name ? "#FF85A2" : "#8F90A6"}
          />
          <Text style={[
            styles.communityName,
            selectedCategory === item.name && styles.communityNameActive
          ]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [selectedCategory]);

  // Post rendering with animations
  const renderPost = useCallback(({ item, index }) => (
    <PostItem
      item={item}
      index={index}
      scrollY={scrollY}
      likedPosts={likedPosts}
      handleLike={handleLike}
      setPosts={setPosts}
    />
  ), [scrollY, likedPosts, handleLike, setPosts]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  }, []);

  const handleNewPost = (newPost) => {
    const post = {
      ...newPost,
      author: newPost.isAnonymous ? "Anonymous" : "Current User",
      isAnonymous: newPost.isAnonymous,
      timestamp: "Just now",
    };
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  const sortPosts = useCallback((postsToSort) => {
    if (isRefreshing) {
      switch(sortBy) {
        case 'new':
          return [...postsToSort].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        case 'hot':
          return [...postsToSort].sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
        case 'top':
          return [...postsToSort].sort((a, b) => b.likes - a.likes);
        default:
          return postsToSort;
      }
    }
    return postsToSort;
  }, [sortBy, isRefreshing]);

  useEffect(() => {
    if (showWelcomeModal) {
      Animated.sequence([
        Animated.delay(500),
        Animated.spring(welcomeAnimation, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true
        })
      ]).start();
    } else {
      welcomeAnimation.setValue(0);
    }
  }, [showWelcomeModal]);

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity
        }
      ]}
    >
      <Text style={styles.headerTitle}>
        {selectedCategory === "All" ? "Community" : selectedCategory}
      </Text>
      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={() => setShowSortModal(true)}
          style={styles.sortButton}
        >
          <MaterialIcons name="sort" size={24} color="#FF85A2" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF85A2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        {renderHeader()}
        
        <Animated.FlatList
          horizontal
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: categoryScrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
      </View>

      <Animated.FlatList
        data={sortPosts(posts.filter(post => {
          if (selectedCategory === "My Posts") {
            return post.userId === userData?.uid;
          }
          return selectedCategory === "All" || post.category === selectedCategory;
        }))}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.postsContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={() => (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No posts yet</Text>
          </View>
        )}
        ListHeaderComponent={() => selectedCategory !== "All" && selectedCategory !== "My Posts" ? (
          <View style={styles.joinButtonWrapper}>
            <TouchableOpacity
              onPress={() => {
                setJoinedCommunities(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(selectedCategory)) {
                    newSet.delete(selectedCategory);
                  } else {
                    newSet.add(selectedCategory);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }
                  return newSet;
                });
              }}
              style={[
                styles.joinCommunityButton,
                joinedCommunities.has(selectedCategory) && styles.joinedCommunityButton
              ]}
            >
              <Text style={[
                styles.joinButtonText,
                joinedCommunities.has(selectedCategory) && styles.joinedButtonText
              ]}>
                {joinedCommunities.has(selectedCategory) ? 'Joined' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#FF85A2"
            colors={['#FF85A2']}
          />
        }
      />

      <SortModal 
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <NewPostModal
        visible={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        onPost={handleNewPost}
      />
      
      <WelcomeModal 
        visible={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        animation={welcomeAnimation}
      />

      <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={() => setShowNewPostModal(true)}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="create-outline" size={24} color="#ffffff" />
          <Text style={styles.floatingButtonText}>New post</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    marginRight: 12,
    padding: 8,
  },
  myPostsButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  myPostsButtonActive: {
    backgroundColor: '#FFE4EC',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  communityButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 120,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
  },
  communityButtonActive: {
    backgroundColor: '#FFE4EC',
    borderColor: '#FF85A2',
    borderWidth: 1,
  },
  communityIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  communityName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D2D3A',
    marginLeft: 4,
  },
  communityNameActive: {
    color: '#FF85A2',
  },
  postsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sortModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  sortOptions: {
    marginTop: 20,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sortOptionActive: {
    backgroundColor: '#FFE4EC',
    borderRadius: 12,
  },
  sortOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#8F90A6',
  },
  sortOptionTextActive: {
    color: '#FF85A2',
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pinnedText: {
    color: '#FF85A2',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#FFE4EC',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2D3A',
  },
  timestamp: {
    fontSize: 12,
    color: '#8F90A6',
  },
  categoryBadge: {
    backgroundColor: '#FFE4EC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D3A',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#4A4B57',
    lineHeight: 20,
    marginBottom: 12,
  },
  postImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 12,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reactionCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reactionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  reactionCountText: {
    fontSize: 12,
    color: '#8F90A6',
    fontWeight: '500',
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#FFE4EC',
    paddingTop: 12,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
  },
  footerButtonText: {
    marginLeft: 6,
    color: '#8F90A6',
    fontSize: 15,
  },
  footerButtonTextActive: {
    color: '#FF85A2',
  },
  welcomeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  giftContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    gap: 8,
  },
  overlappingIcon: {
    marginLeft: 0,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D2D3A',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#4A4B57',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  guidelineContainer: {
    backgroundColor: '#FFE4EC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  guidelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF85A2',
    marginBottom: 8,
  },
  guidelineText: {
    fontSize: 14,
    color: '#4A4B57',
    lineHeight: 24,
  },
  welcomeButton: {
    backgroundColor: '#FF85A2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  welcomeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  newPostModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  newPostModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    paddingBottom: 24,
  },
  newPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginBottom: 16,
  },
  closeButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
  },
  newPostTitle: {
        fontSize: 20,
    fontWeight: '700',
    color: '#2D2D3A',
  },
  postButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF85A2',
    borderRadius: 20,
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  postButtonDisabled: {
    backgroundColor: '#FFE4EC',
    shadowOpacity: 0,
    elevation: 0,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#FF85A2',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2D3A',
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 56,
  },
  contentInput: {
    fontSize: 16,
    color: '#4A4B57',
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    height: 200,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    textAlignVertical: 'top',
  },
  imageContainer: {
    height: 120,
    marginBottom: 16,
  },
  imagePreviewContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F8F8F8',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addImageText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FF85A2',
    fontWeight: '600',
  },
  categorySelector: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2D3A',
    marginBottom: 16,
    marginLeft: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    margin: 4,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryChipActive: {
    backgroundColor: '#FFE4EC',
    borderColor: '#FF85A2',
    borderWidth: 1,
    shadowColor: '#FF85A2',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  categoryChipText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#8F90A6',
  },
  categoryChipTextActive: {
    color: '#FF85A2',
    fontWeight: '600',
  },
  floatingEmoji: {
    position: 'absolute',
    fontSize: 24,
  },
  commentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  commentModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4EC',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D2D3A',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4EC',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    fontSize: 15,
    color: '#2D2D3A',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#FFE4EC',
    minHeight: 45,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4EC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  commentsList: {
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
    opacity: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFE4EC',
  },
  replyComment: {
    marginLeft: 32,
    borderStyle: 'dashed',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFE4EC',
    backgroundColor: '#FFE4EC',
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderTopLeftRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D2D3A',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#8F90A6',
    fontStyle: 'italic',
  },
  commentText: {
    fontSize: 14,
    color: '#4A4B57',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FFE4EC',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 16,
    backgroundColor: '#FFE4EC',
    borderRadius: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#FF85A2',
    fontWeight: '600',
  },
  actionTextActive: {
    color: '#FF85A2',
    fontWeight: '700',
  },
  joinButtonWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  joinCommunityButton: {
    backgroundColor: '#FF85A2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  joinedCommunityButton: {
    backgroundColor: '#8F90A6',
    shadowColor: '#8F90A6',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: '#ffffff',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  newPostForm: {
    flex: 1,
    paddingHorizontal: 20,
  },
  newPostFormContent: {
    paddingBottom: 40,
  },
  heartAnimationContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8F90A6',
    textAlign: 'center',
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 125,
    alignSelf: 'center',
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF85A2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF85A2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 10,
    fontWeight: '600',
  },
});

export default Community;