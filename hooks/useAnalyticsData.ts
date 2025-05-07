import { useState, useEffect, useCallback } from 'react';
import { FinanceEntry, FilterParams, FinanceAnalyticsData } from '../interfaces/types';
import * as analyticsService from '../services/analyticsService';

export const useAnalyticsData = () => {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [analytics, setAnalytics] = useState<FinanceAnalyticsData | null>(null);
  const [currentFilters, setCurrentFilters] = useState<FilterParams | null>(null);

  const fetchFinanceData = useCallback(async (filters: FilterParams) => {
    setLoading(true);
    setError(null);
    setCurrentFilters(filters);

    try {
      const response = await analyticsService.fetchFinanceDataFromAPI(filters);

      setEntries(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);

      // Process data for analytics
      const analyticsData = analyticsService.processAnalyticsData(response.content);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError('Failed to fetch finance data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (!currentFilters) return;

    setRefreshing(true);
    try {
      await fetchFinanceData(currentFilters);
    } finally {
      setRefreshing(false);
    }
  }, [currentFilters, fetchFinanceData]);

  return {
    entries,
    loading,
    refreshing,
    error,
    totalPages,
    totalElements,
    analytics,
    fetchFinanceData,
    refreshData,
  };
};
