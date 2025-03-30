import React, { createContext, useState, useContext, ReactNode } from "react";

interface Job {
  id: string;
  title: string;
  companyName?: string;
  location?: string;
  salary?: string;
}

interface JobContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (jobId: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  const saveJob = (job: Job) => {
    if (!savedJobs.some((j) => j.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const removeJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
  };

  return (
    <JobContext.Provider value={{ savedJobs, saveJob, removeJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = (): JobContextType => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobContext must be used within a JobProvider");
  }
  return context;
};
