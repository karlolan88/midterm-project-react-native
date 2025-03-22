import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'https://empllo.com/api/v1';

export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
}

const useFetchJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async () => {
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
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  return { jobs, loading, refreshing, onRefresh };
};

export default useFetchJobs;
