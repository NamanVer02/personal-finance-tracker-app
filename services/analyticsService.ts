import { FilterParams, FinanceEntry } from '../interfaces/types';
import apiClient from './apiClient';

export const fetchFinanceDataFromAPI = async (filters: FilterParams) => {
  // Convert filters to query params
  const params = new URLSearchParams();

  if (filters.type) params.append('type', filters.type);
  if (filters.category) params.append('category', filters.category);
  if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
  if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);

  params.append('page', filters.page.toString());
  params.append('size', filters.size.toString());
  filters.sort.forEach((sort) => params.append('sort', sort));

  try {
    const response = await apiClient.get(`/api/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error occured while fetching data: ", error)
  }
};

export const processAnalyticsData = (data: FinanceEntry[]) => {
  // Calculate totals
  let totalIncome = 0;
  let totalExpense = 0;

  // Category breakdown
  const categoryMap = new Map<string, number>();

  // Monthly trend data
  const monthlyData = new Map<string, { income: number; expense: number }>();

  data.forEach((entry) => {
    const amount = Number(entry.amount);

    // Calculate totals
    if (entry.type === 'Income') {
      totalIncome += amount;
    } else {
      totalExpense += amount;
    }

    // Update category breakdown
    const currentCategoryAmount = categoryMap.get(entry.category) || 0;
    categoryMap.set(entry.category, currentCategoryAmount + amount);

    // Update monthly trend
    const month = new Date(entry.date).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
    const currentMonthData = monthlyData.get(month) || { income: 0, expense: 0 };

    if (entry.type === 'Income') {
      currentMonthData.income += amount;
    } else {
      currentMonthData.expense += amount;
    }

    monthlyData.set(month, currentMonthData);
  });

  // Calculate category percentages
  const totalAmount = totalIncome + totalExpense;
  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
  }));

  // Convert monthly data to array
  const monthlyTrend = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    categoryBreakdown,
    monthlyTrend,
  };
};
