import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { 
  View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, RefreshControl, useColorScheme, Alert 
} from 'react-native';
import uuid from "react-native-uuid";
import { useNavigation } from '@react-navigation/native';

const API_URL = "https://empllo.com/api/v1";

interface Job {
  id: string;
  title: string;
  companyName?: string;
  location?: string;
  description?: string;
  salary?: string;
  jobType?: string;
  mainCategory?: string;
  expiryDate?: string;
}

const JobFinderScreen: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>{isDarkMode ? '🌞' : '🌙'}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDarkMode]);

  const fetchJobs = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data.jobs)) {
        throw new Error("Invalid response format: Expected an array of jobs.");
      }

      const jobsWithId = data.jobs.map((job: Job) => ({
        id: job.id || uuid.v4(),
        title: job.title || "Unknown Title",
        companyName: job.companyName || "Unknown Company",
        location: job.location || "Location not specified",
        description: job.description || "No description available",
        salary: job.salary || "Salary not specified",
        jobType: job.jobType || "Not specified",
      }));

      setJobs(jobsWithId);
    } catch (error: any) {
      console.error("Error fetching jobs:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  }, []);

  const saveJob = (job: Job) => {
    if (!savedJobs.find(j => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
      Alert.alert("Job Saved", `You saved ${job.title} for later.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <TextInput 
        style={[styles.searchBar, isDarkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Search Jobs" 
        placeholderTextColor={isDarkMode ? '#ccc' : '#555'}
        value={searchQuery} 
        onChangeText={setSearchQuery} 
      />

      <FlatList 
        data={jobs.filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={[styles.jobCard, isDarkMode ? styles.darkJobCard : styles.lightJobCard]}>
            <Text style={[styles.jobTitle, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>{item.companyName}</Text>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>{item.location}</Text>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>Salary: {item.salary}</Text>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={() => saveJob(item)}
            >
              <Text style={styles.buttonText}>
                {savedJobs.find(j => j.id === item.id) ? 'Saved' : 'Save Job'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={() => navigation.navigate('ApplicationForm', { job: item })}
            >
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  lightInput: {
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    color: '#000',
  },
  darkInput: {
    borderColor: '#444',
    backgroundColor: '#333',
    color: '#fff',
  },
  jobCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  lightJobCard: {
    backgroundColor: '#f9f9f9',
  },
  darkJobCard: {
    backgroundColor: '#222',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  applyButton: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    padding: 10,
    marginRight: 15,
  },
  headerButtonText: {
    fontSize: 20,
  },
});

export default JobFinderScreen;
