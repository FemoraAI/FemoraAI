"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

// Modern and vibrant color palette
const COLORS = {
  background: "#F5F5F5", // Light gray background
  primary: "#3498db", // A vibrant blue
  secondary: "#e74c3c", // A contrasting red
  accent: "#f39c12", // A warm orange
  textDark: "#2c3e50", // Dark gray text
  textLight: "#7f8c8d", // Light gray text
  white: "#FFFFFF", // White
}

// Enhanced demo data with better image URLs
const demoContent = [
  {
    id: 1,
    title: "Understanding Your Menstrual Cycle",
    type: "Article",
    phase: "General",
    image: "https://images.unsplash.com/photo-1542626991-cbc4e3e8c261?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGh1bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    duration: "5 min read",
  },
  {
    id: 2,
    title: "Nutrition During Your Period",
    type: "Video",
    phase: "Menstrual",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bnV0cml0aW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    duration: "10 min watch",
  },
  {
    id: 3,
    title: "Maximizing Productivity in the Follicular Phase",
    type: "Webinar",
    phase: "Follicular",
    image: "https://images.unsplash.com/photo-1556761175-b413da4caea8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdGl2aXR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    duration: "45 min webinar",
  },
  {
    id: 4,
    title: "Exercise Tips for the Ovulation Phase",
    type: "Article",
    image: "https://images.unsplash.com/photo-1584735935682-59d866698a7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZXhlcmNpc2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    phase: "Ovulation",
    duration: "7 min read",
  },
  {
    id: 5,
    title: "Managing PMS Symptoms",
    type: "Video",
    phase: "Luteal",
    image: "https://images.unsplash.com/photo-1543755074-714cb2102985?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHN5bXB0b21zfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    duration: "15 min watch",
  },
  {
    id: 6,
    title: "Hormonal Balance and Your Diet",
    type: "Webinar",
    phase: "General",
    image: "https://images.unsplash.com/photo-1560717477-ad51fedd888f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGhvc3BpdGFsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    duration: "60 min webinar",
  },
]

const EducationalContent = () => {
  const [selectedPhase, setSelectedPhase] = useState("All")
  const phases = ["All", "General", "Menstrual", "Follicular", "Ovulation", "Luteal"]

  const filteredContent =
    selectedPhase === "All" ? demoContent : demoContent.filter((item) => item.phase === selectedPhase)

  const renderContentItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.contentItem}>
      <Image source={{ uri: item.image }} style={styles.contentImage} />
      <View style={styles.contentInfo}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        <View style={styles.contentMeta}>
          <Text style={styles.contentType}>{item.type}</Text>
          <Text style={styles.contentDuration}>{item.duration}</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Explore Educational Content</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.phaseFilter}>
          {phases.map((phase) => (
            <TouchableOpacity
              key={phase}
              style={[styles.phaseButton, selectedPhase === phase && styles.selectedPhaseButton]}
              onPress={() => setSelectedPhase(phase)}
            >
              <Text style={[styles.phaseButtonText, selectedPhase === phase && styles.selectedPhaseButtonText]}>
                {phase}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.contentList}>{filteredContent.map(renderContentItem)}</View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 24,
    textAlign: "center",
    textTransform: "capitalize",
  },
  phaseFilter: {
    marginBottom: 20,
  },
  phaseButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedPhaseButton: {
    backgroundColor: COLORS.primary,
  },
  phaseButtonText: {
    color: COLORS.textLight,
    fontWeight: "600",
  },
  selectedPhaseButtonText: {
    color: COLORS.white,
  },
  contentList: {
    marginTop: 10,
  },
  contentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  contentImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  contentMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentType: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 10,
  },
  contentDuration: {
    fontSize: 14,
    color: COLORS.textLight,
  },
})

export default EducationalContent
