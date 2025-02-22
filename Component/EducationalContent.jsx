"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from "react-native"
import MasonryList from '@react-native-seoul/masonry-list'
import { MaterialIcons } from "@expo/vector-icons"

// Soft, modern color palette
const COLORS = {
  background: "#F9F9F9",
  primary: "#FF7AA2",
  secondary: "#6C757D",
  accent: "#FFB6C1",
  text: "#2D2D2D",
  lightText: "#888888",
  white: "#FFFFFF",
}

const demoContent = [
  {
    id: 1,
    title: "Understanding Your Cycle",
    type: "Article",
    image: "https://images.pexels.com/photos/4473398/pexels-photo-4473398.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "5 min read"
  },
  {
    id: 2,
    title: "Nutrition Guide",
    type: "Video",
    image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "10 min watch"
  },
  {
    id: 3,
    title: "Productivity Tips",
    type: "Article",
    image: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "7 min read"
  },
  {
    id: 4,
    title: "Exercise Routines",
    type: "Guide",
    image: "https://images.pexels.com/photos/6997796/pexels-photo-6997796.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "15 min read"
  },
  {
    id: 5,
    title: "Mental Wellness",
    type: "Podcast",
    image: "https://images.pexels.com/photos/7176036/pexels-photo-7176036.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "20 min listen"
  },
  {
    id: 6,
    title: "Hormone Health",
    type: "Webinar",
    image: "https://images.pexels.com/photos/5721871/pexels-photo-5721871.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "30 min watch"
  }
]

const EducationalContent = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Learn More</Text>
        
        <MasonryList
          data={demoContent}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardType}>{item.type}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardFooter}>
                  <MaterialIcons name="access-time" size={14} color={COLORS.lightText} />
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.masonryContainer}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  masonryContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 6,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  cardType: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    color: COLORS.lightText,
    fontSize: 12,
    marginLeft: 4,
  },
})

export default EducationalContent