import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

export interface Domain {
  name: string;
  color: string;
  categories: string[];
  skills: string[];
  levels: Record<number, { title: string; xp_required: number }>;
  problem_count: number;
}

export interface DomainProgress {
  user_id: string;
  domain: string;
  level: number;
  experience_points: number;
  problems_solved: number;
  average_score: number;
  time_spent: number;
  streak: number;
  last_activity: string;
  skills_unlocked: string[];
}

interface DomainContextType {
  selectedDomain: string | null;
  setSelectedDomain: (domain: string | null) => void;
  domains: Domain[];
  loading: boolean;
  error: string | null;
  domainProgress: DomainProgress | null;
  fetchDomainProgress: (domain: string) => Promise<void>;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

interface DomainProviderProps {
  children: ReactNode;
}

export const DomainProvider: React.FC<DomainProviderProps> = ({ children }) => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(
    localStorage.getItem('selectedDomain')
  );
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [domainProgress, setDomainProgress] = useState<DomainProgress | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      localStorage.setItem('selectedDomain', selectedDomain);
      fetchDomainProgress(selectedDomain);
    } else {
      localStorage.removeItem('selectedDomain');
      setDomainProgress(null);
    }
  }, [selectedDomain]);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      setError(null);
      const domainsData = await apiService.getDomains();
      setDomains(domainsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch domains');
      console.error('Error fetching domains:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDomainProgress = async (domain: string) => {
    try {
      // For now, use a mock user ID - in production this would come from auth
      const userId = 'user_1';
      const progress = await apiService.getUserDomainProgress(userId, domain);
      setDomainProgress(progress);
    } catch (err) {
      console.error('Error fetching domain progress:', err);
    }
  };

  const value: DomainContextType = {
    selectedDomain,
    setSelectedDomain,
    domains,
    loading,
    error,
    domainProgress,
    fetchDomainProgress
  };

  return (
    <DomainContext.Provider value={value}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = (): DomainContextType => {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  return context;
};