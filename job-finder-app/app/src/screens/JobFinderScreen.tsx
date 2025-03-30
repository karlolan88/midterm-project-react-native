import React, { useState, useEffect, useLayoutEffect } from "react";
import { 
  View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert 
} from "react-native";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const API_URL = "https://empllo.com/api/v1";

interface Job {
  id: string;
  title: string;
  companyName?: string;
  location?: string;
  salary?: string;
}

const JobFinderScreen: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchJobs();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.darkModeButton} onPress={toggleTheme}>
          <Text style={styles.buttonText}>{isDarkMode ? "Light☀️" : "Dark🌙"}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDarkMode]);

  const fetchJobs = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.jobs)) throw new Error("Invalid response format: Expected an array of jobs.");
      
      const jobsWithId = data.jobs.map((job: Job) => ({
        id: job.id || uuid.v4(),
        title: job.title || "Unknown Title",
        companyName: job.companyName || "Unknown Company",
        location: job.location || "Location not specified",
        salary: job.salary || "Salary not specified",
      }));

      setJobs(jobsWithId);
    } catch (error: any) {
      console.error("Error fetching jobs:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Removed the alert message when saving a job
  const saveJob = (job: Job) => {
    if (!savedJobs.find(j => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Search Input */}
      <TextInput 
        style={[styles.searchBar, isDarkMode && styles.darkInput]}
        placeholder="Search Jobs" 
        placeholderTextColor={isDarkMode ? "#bbb" : "#000"}
        value={searchQuery} 
        onChangeText={setSearchQuery} 
      />

      {/* Navigate to Saved Jobs */}
      <TouchableOpacity 
        style={styles.savedJobsButton}
        onPress={() => navigation.navigate("SavedJobs", { savedJobs })}
      >
        <Text style={styles.buttonText}>View Saved Jobs</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? "#bbb" : "#007bff"} />
      ) : (
        <FlatList 
          data={jobs.filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()))}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.jobCard, isDarkMode && styles.darkCard]}>
              <Text style={[styles.jobTitle, isDarkMode && styles.darkText]}>{item.title}</Text>
              <Text style={isDarkMode && styles.darkText}>{item.companyName}</Text>
              <Text style={isDarkMode && styles.darkText}>{item.location}</Text>
              <Text style={isDarkMode && styles.darkText}>Salary: {item.salary}</Text>

              {/* Buttons Container */}
              <View style={styles.buttonContainer}>
                {/* Save Job Button */}
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={() => saveJob(item)}
                >
                  <Text style={styles.buttonText}>
                    {savedJobs.find(j => j.id === item.id) ? "Saved" : "Save Job"}
                  </Text>
                </TouchableOpacity>

                {/* Apply Button */}
                <TouchableOpacity 
                  style={styles.applyButton} 
                  onPress={() => navigation.navigate("ApplicationForm", { job: item, fromSavedJobs: false })}
                >
                  <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  darkContainer: { backgroundColor: "#121212" },

  searchBar: { height: 40, borderWidth: 1, borderRadius: 8, marginBottom: 10, paddingHorizontal: 10 },
  darkInput: { backgroundColor: "#333", color: "#fff", borderColor: "#666" },

  savedJobsButton: { backgroundColor: "#ff9800", padding: 10, borderRadius: 5, marginBottom: 10 },

  jobCard: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 10 },
  darkCard: { backgroundColor: "#1e1e1e" },

  jobTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  darkText: { color: "#ddd" },

  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  saveButton: { flex: 1, backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginRight: 5 },
  applyButton: { flex: 1, backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginLeft: 5 },

  buttonText: { color: "#fff", textAlign: "center", fontSize: 14 },

  darkModeButton: { 
    backgroundColor: "#444", 
    padding: 5, 
    borderRadius: 5, 
    marginRight: 10, 
    width: 60, 
    alignItems: "center" 
  },
});

export default JobFinderScreen;
