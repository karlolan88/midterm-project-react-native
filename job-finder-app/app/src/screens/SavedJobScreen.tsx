import React, { useState } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, Alert, StyleSheet 
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

interface Job {
  id: string;
  title: string;
  companyName?: string;
  location?: string;
  salary?: string;
}

const SavedJobScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { savedJobs: initialSavedJobs } = route.params as { savedJobs: Job[] };
  const [savedJobs, setSavedJobs] = useState<Job[]>(initialSavedJobs);

  const removeJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    Alert.alert("Job Removed", "This job has been removed from your saved list.");
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      
      {/* Header with Dark Mode Button */}
      <View style={styles.headerContainer}>
        <Text style={[styles.header, isDarkMode && styles.darkText]}>Saved Jobs</Text>

        {/* Dark Mode Toggle Button (Right-Aligned) */}
        <TouchableOpacity style={styles.darkModeButton} onPress={toggleTheme}>
          <Text style={styles.buttonText}>{isDarkMode ? "Light☀️" : "Dark🌙"}</Text>
        </TouchableOpacity>
      </View>

      {savedJobs.length === 0 ? (
        <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>No saved jobs yet.</Text>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.jobCard, isDarkMode && styles.darkCard]}>
              <Text style={[styles.jobTitle, isDarkMode && styles.darkText]}>{item.title}</Text>
              <Text style={[styles.jobDetails, isDarkMode && styles.darkText]}>{item.companyName}</Text>
              <Text style={[styles.jobDetails, isDarkMode && styles.darkText]}>{item.location}</Text>
              <Text style={[styles.jobDetails, isDarkMode && styles.darkText]}>Salary: {item.salary}</Text>

              {/* Buttons Container */}
              <View style={styles.buttonContainer}>
                {/* Apply Button */}
                <TouchableOpacity 
                  style={styles.applyButton} 
                  onPress={() => 
                    navigation.navigate("ApplicationForm", { job: item, fromSavedJobs: true })
                  }
                >
                  <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>

                {/* Remove Button */}
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeJob(item.id)}
                >
                  <Text style={styles.buttonText}>Remove</Text>
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

  headerContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 10 
  },

  header: { fontSize: 22, fontWeight: "bold" },
  darkText: { color: "#ddd" },

  darkModeButton: { backgroundColor: "#444", padding: 10, borderRadius: 5 },

  emptyText: { fontSize: 16, textAlign: "center", marginTop: 20, color: "#777" },

  jobCard: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 10, elevation: 3 },
  darkCard: { backgroundColor: "#1e1e1e" },

  jobTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  jobDetails: { fontSize: 14, color: "#555" },

  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  applyButton: { flex: 1, backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginRight: 5 },
  removeButton: { flex: 1, backgroundColor: "#dc3545", padding: 10, borderRadius: 5, marginLeft: 5 },

  buttonText: { color: "#fff", textAlign: "center", fontSize: 16 },
});

export default SavedJobScreen;
