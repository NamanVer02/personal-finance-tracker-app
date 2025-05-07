// FinancialAnalysisScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { FilterParams } from '../interfaces/types';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function FinancialAnalysisScreen() {
  const navigation = useNavigation();

  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [filters, setFilters] = useState<FilterParams>({
    page: 0,
    size: 100, // Get more data for better analysis
    sort: ['date,desc'],
  });
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, analytics, fetchFinanceData } = useAnalyticsData();

  const updateDateRange = useCallback(
    (range: 'week' | 'month' | 'year') => {
      setDateRange(range);

      // Calculate date range based on selection
      const endDate = new Date();
      let startDate = new Date();

      if (range === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (range === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }

      // Format dates for API
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      // Update filters and fetch data
      const newFilters = {
        ...filters,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      setFilters(newFilters);
      fetchFinanceData(newFilters);
    },
    [filters, fetchFinanceData]
  );

  const handleApplyFilters = useCallback(
    (newFilters: FilterParams) => {
      setFilters(newFilters);
      fetchFinanceData(newFilters);
    },
    [fetchFinanceData]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFinanceData(filters).finally(() => setRefreshing(false));
  }, [filters, fetchFinanceData]);

  // Initial data fetch
  useEffect(() => {
    updateDateRange('month');
  }, []);

  const renderDateRangeSelector = () => (
    <View className="mx-4 mb-6 flex-row justify-center rounded-full bg-white p-1">
      <TouchableOpacity
        className={`flex-1 rounded-full py-2 ${dateRange === 'week' ? 'bg-purple-500' : 'bg-transparent'}`}
        onPress={() => updateDateRange('week')}>
        <Text
          className={`text-center font-medium ${dateRange === 'week' ? 'text-white' : 'text-gray-600'}`}>
          Week
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 rounded-full py-2 ${dateRange === 'month' ? 'bg-purple-500' : 'bg-transparent'}`}
        onPress={() => updateDateRange('month')}>
        <Text
          className={`text-center font-medium ${dateRange === 'month' ? 'text-white' : 'text-gray-600'}`}>
          Month
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 rounded-full py-2 ${dateRange === 'year' ? 'bg-purple-500' : 'bg-transparent'}`}
        onPress={() => updateDateRange('year')}>
        <Text
          className={`text-center font-medium ${dateRange === 'year' ? 'text-white' : 'text-gray-600'}`}>
          Year
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSummaryCards = () => (
    <View className="mb-6 flex-row justify-between px-4">
      <View className="w-[47%] rounded-xl bg-white p-4 shadow-sm">
        <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <Octicons name="arrow-down" size={16} color="#10b981" />
        </View>
        <Text className="text-xs text-gray-500">Income</Text>
        <Text className="text-base font-bold text-gray-800">
          ${analytics?.totalIncome.toFixed(2)}
        </Text>
      </View>

      <View className="w-[47%] rounded-xl bg-white p-4 shadow-sm">
        <View className="mb-2 h-8 w-8 items-center justify-center rounded-full bg-red-100">
          <Octicons name="arrow-up" size={16} color="#ef4444" />
        </View>
        <Text className="text-xs text-gray-500">Expenses</Text>
        <Text className="text-base font-bold text-gray-800">
          ${analytics?.totalExpense.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderMonthlyTrendChart = () => {
    if (!analytics || !analytics.monthlyTrend.length) return null;

    const chartData = {
      labels: analytics.monthlyTrend.map((item) => item.month),
      datasets: [
        {
          data: analytics.monthlyTrend.map((item) => item.income),
          color: () => '#10b981', // green
          strokeWidth: 2,
        },
        {
          data: analytics.monthlyTrend.map((item) => item.expense),
          color: () => '#ef4444', // red
          strokeWidth: 2,
        },
      ],
      legend: ['Income', 'Expenses'],
    };

    return (
      <View className="mx-4 mb-6 rounded-xl bg-white p-4 shadow-sm">
        <Text className="mb-4 text-lg font-semibold">Income vs Expenses</Text>
        <BarChart
          data={chartData}
          width={screenWidth - 96}
          height={220}
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    );
  };

  const renderCategoryBreakdown = () => {
    if (!analytics || !analytics.categoryBreakdown.length) return null;

    // Prepare data for pie chart
    const pieData = analytics.categoryBreakdown.map((item, index) => {
      const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
      return {
        name: item.category,
        amount: item.amount,
        percentage: item.percentage,
        color: colors[index % colors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      };
    });

    return (
      <View className="mx-4 mb-6 rounded-xl bg-white p-4 shadow-sm">
        <Text className="mb-4 text-lg font-semibold">Spending by Category</Text>
        <PieChart
          data={pieData}
          width={screenWidth - 48}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={false}
        />

        <View className="mt-4">
          {analytics.categoryBreakdown.map((item, index) => (
            <View key={index} className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: pieData[index].color }}
                />
                <Text className="text-gray-800">{item.category}</Text>
              </View>
              <View className="flex-row">
                <Text className="mr-2 text-gray-600">${item.amount.toFixed(2)}</Text>
                <Text className="text-gray-500">({item.percentage.toFixed(1)}%)</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading && !analytics) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="mt-4 text-gray-600">Loading financial data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Octicons name="alert" size={48} color="#ef4444" />
        <Text className="mt-4 text-lg font-semibold text-gray-800">Something went wrong</Text>
        <Text className="mt-2 text-center text-gray-600">{error}</Text>
        <TouchableOpacity
          className="mt-6 rounded-full bg-purple-500 px-6 py-3"
          onPress={() => fetchFinanceData(filters)}>
          <Text className="font-medium text-white">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between px-4">
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <Octicons name="arrow-left" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Financial Analytics</Text>
        {/* Empty View to maintain spacing */}
        <View style={{ width: 32 }} /> {/* Same width as the back button */}
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8b5cf6']}
            tintColor="#8b5cf6"
          />
        }>
        {renderDateRangeSelector()}

        {analytics ? (
          <>
            {renderSummaryCards()}
            {renderMonthlyTrendChart()}
            {renderCategoryBreakdown()}
            <View className="h-20" /> {/* Bottom spacing */}
          </>
        ) : (
          <View className="flex-1 items-center justify-center p-8">
            <Octicons name="graph" size={48} color="#d1d5db" />
            <Text className="mt-4 text-lg font-semibold text-gray-800">No data available</Text>
            <Text className="mt-2 text-center text-gray-600">
              Try adjusting your filters or add some transactions to see your financial analysis.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
