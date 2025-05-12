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
  StatusBarStyle,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { FilterParams } from '../interfaces/types';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';

const screenWidth = Dimensions.get('window').width;

export default function FinancialAnalysisScreen() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFinanceData(filters).finally(() => setRefreshing(false));
  }, [filters, fetchFinanceData]);

  // Initial data fetch
  useEffect(() => {
    updateDateRange('month');
  }, []);

  const renderDateRangeSelector = () => (
    <View
      className={`mx-4 mb-6 flex-row justify-center rounded-full ${styles.bgSecondary} p-1`}>
      <TouchableOpacity
        className={`flex-1 rounded-full py-2 ${dateRange === 'week' ? 'bg-purple-500' : 'bg-transparent'}`}
        onPress={() => updateDateRange('week')}>
        <Text
          className={`text-center font-medium ${
            dateRange === 'week' ? 'text-white' : styles.textSecondary
          }`}>
          Week
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 rounded-full py-2 ${dateRange === 'month' ? 'bg-purple-500' : 'bg-transparent'}`}
        onPress={() => updateDateRange('month')}>
        <Text
          className={`text-center font-medium ${
            dateRange === 'month' ? 'text-white' : styles.textSecondary
          }`}>
          Month
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 rounded-full py-2 ${dateRange === 'year' ? 'bg-purple-500' : 'bg-transparent'}`}
        onPress={() => updateDateRange('year')}>
        <Text
          className={`text-center font-medium ${
            dateRange === 'year' ? 'text-white' : styles.textSecondary
          }`}>
          Year
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSummaryCards = () => (
    <View className="mb-6 flex-row justify-between px-4">
      <View className={`w-[47%] rounded-xl ${styles.bgSecondary} p-4`}>
        <View
          className={`mb-2 h-8 w-8 items-center justify-center rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
          <Text>
            <Octicons name="arrow-down" size={16} color="#10b981" />
          </Text>
        </View>
        <Text className={styles.textSecondary}>Income</Text>
        <Text className={`text-base font-bold ${styles.textPrimary}`}>
          ${analytics?.totalIncome.toFixed(2)}
        </Text>
      </View>

      <View className={`w-[47%] rounded-xl ${styles.bgSecondary} p-4`}>
        <View
          className={`mb-2 h-8 w-8 items-center justify-center rounded-full ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
          <Text>
            <Octicons name="arrow-up" size={16} color="#ef4444" />
          </Text>
        </View>
        <Text className={styles.textSecondary}>Expenses</Text>
        <Text className={`text-base font-bold ${styles.textPrimary}`}>
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
      <View className={`mx-4 mb-6 rounded-xl ${styles.bgSecondary} p-4`}>
        <Text className={`mb-4 text-lg font-semibold ${styles.textPrimary}`}>
          Income vs Expenses
        </Text>
        <BarChart
          data={chartData}
          width={screenWidth - 96}
          height={220}
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0,
            color: (opacity = 1) =>
              isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) =>
              isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
            propsForBackgroundLines: {
              stroke: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              strokeDasharray: '0',
            },
            barPercentage: 0.65,
            // Add these properties to control bar color
            fillShadowGradient: isDarkMode ? '#9CA3AF' : '#9CA3AF',
            fillShadowGradientOpacity: 0.2,
          }}
          withInnerLines={false}
          showValuesOnTopOfBars={false}
          fromZero
          withHorizontalLabels={true}
          style={{
            borderRadius: 16,
            backgroundColor: 'transparent',
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
        legendFontColor: isDarkMode ? '#d1d5db' : '#7F7F7F',
        legendFontSize: 12,
      };
    });

    return (
      <View className={`mx-4 mb-6 rounded-xl ${styles.bgSecondary} p-4`}>
        <Text className={`mb-4 text-lg font-semibold ${styles.textPrimary}`}>
          Spending by Category
        </Text>
        <PieChart
          data={pieData}
          width={screenWidth - 96}
          height={220}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: 'transparent',
            backgroundGradientTo: 'transparent',
            color: (opacity = 1) =>
              isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) =>
              isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={true}
          style={{
            borderRadius: 16,
            backgroundColor: 'transparent',
          }}
        />

        <View className="mt-4">
          {analytics.categoryBreakdown.map((item, index) => (
            <View key={index} className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: pieData[index].color }}
                />
                <Text className={styles.textPrimary}>{item.category}</Text>
              </View>
              <View className="flex-row">
                <Text className={`mr-2 ${styles.textSecondary}`}>${item.amount.toFixed(2)}</Text>
                <Text className={styles.textMuted}>({item.percentage.toFixed(1)}%)</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading && !analytics) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${styles.bgPrimary}`}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className={`mt-4 ${styles.textSecondary}`}>Loading financial data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${styles.bgPrimary} p-4`}>
        <Text>
          <Octicons name="alert" size={48} color="#ef4444" />
        </Text>
        <Text className={`mt-4 text-lg font-semibold ${styles.textPrimary}`}>
          Something went wrong
        </Text>
        <Text className={`mt-2 text-center ${styles.textSecondary}`}>{error}</Text>
        <TouchableOpacity
          className="mt-6 rounded-full bg-purple-500 px-6 py-3"
          onPress={() => fetchFinanceData(filters)}>
          <Text className="font-medium text-white">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${styles.bgPrimary}`}
      style={{ backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb' }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : ('dark-content' as StatusBarStyle)}
        backgroundColor={isDarkMode ? '#1f2937' : '#f9fafb'}
      />

      {/* Header */}
      <View className="mb-6 mt-4 flex-row items-center justify-between px-4">
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <Text>
            <Octicons name="arrow-left" size={24} color={isDarkMode ? '#d1d5db' : '#6b7280'} />
          </Text>
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${styles.textPrimary}`}>Financial Analytics</Text>
        <View style={{ width: 32 }} />
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
            <Text>
              <Octicons name="graph" size={48} color={isDarkMode ? '#4b5563' : '#d1d5db'} />
            </Text>
            <Text className={`mt-4 text-lg font-semibold ${styles.textPrimary}`}>
              No data available
            </Text>
            <Text className={`mt-2 text-center ${styles.textSecondary}`}>
              Try adjusting your filters or add some transactions to see your financial analysis.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
