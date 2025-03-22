import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'https://empllo.com/api/v1';

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
}

const JobFinderScreen: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      const jobsWithId = response.data.map((job: any) => ({
        id: uuidv4(),
        title: job.title || 'No Title',
        company: job.company || 'Unknown Company',
        salary: job.salary || 'Not Specified',
      }));
      setJobs(jobsWithId);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const saveJob = (job: Job) => {
    if (!savedJobs.find(j => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
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
    <View style={styles.container}>
      <TextInput 
        style={styles.searchBar}
        placeholder="Search Jobs" 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
      />
      <FlatList 
        data={jobs.filter(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text>{item.company}</Text>
            <Text>Salary: {item.salary}</Text>
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
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  jobCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default JobFinderScreen;
