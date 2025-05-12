import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { fetchAllTransactions } from 'services/transactionService';
import { useNavigation } from '@react-navigation/native';
import { Transaction, FetchAllTransactionParams } from 'interfaces/types';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';
import FilterModal from 'components/modals/FilterModal';

const Transactions = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactionsData, setTransactionsData] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    totalElements: 0,
  });
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based indexing
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<FetchAllTransactionParams>({});

  useEffect(() => {
    loadTransactions();
  }, [currentPage, filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetchAllTransactions({
        page: currentPage,
        ...filters,
      });
      setTransactionsData(response);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadTransactions();
    } finally {
      setRefreshing(false);
    }
  }, [currentPage, filters]);

  const applyFilters = (newFilters: FetchAllTransactionParams) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when applying filters
  };

  const resetFilters = () => {
    setFilters({});
    setCurrentPage(0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      // Income categories
      case 'Salary':
        return 'briefcase';
      case 'Investments':
        return 'graph';
      case 'Gifts':
        return 'gift';
      case 'Refunds':
        return 'arrow-switch';

      // Expense categories
      case 'Food & Drinks':
        return 'flame';
      case 'Shopping':
        return 'package';
      case 'Transportation':
        return 'rocket';
      case 'Bills':
        return 'note';
      case 'Entertainment':
        return 'device-camera-video';
      case 'Health':
        return 'pulse';
      case 'Education':
        return 'book';

      // Default fallback
      case 'Other':
      default:
        return 'ellipsis';
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < transactionsData.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${styles.bgPrimary}`}
      style={{ backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb' }}>
      {/* Header */}
      <View className="mb-6 mt-4 flex-row items-center justify-between px-4">
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <Text>
            <Octicons name="arrow-left" size={24} color={isDarkMode ? '#d1d5db' : '#6b7280'} />
          </Text>
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${styles.textPrimary}`}>All Transactions</Text>
        <TouchableOpacity className="p-2" onPress={() => setFilterModalVisible(true)}>
          <Text>
            <Octicons
              name="filter"
              size={24}
              color={
                Object.keys(filters).length > 0 ? '#8b5cf6' : isDarkMode ? '#d1d5db' : '#6b7280'
              }
            />
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8b5cf6']}
            tintColor="#8b5cf6"
          />
        }>
        {/* Filters indicator */}
        {Object.keys(filters).length > 0 && (
          <View
            className={`mx-6 mb-4 rounded-lg p-3 ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
            <Text
              className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              Filters applied •{' '}
              <TouchableOpacity onPress={resetFilters}>
                <Text className="underline">Reset</Text>
              </TouchableOpacity>
            </Text>
          </View>
        )}

        <View className="mb-6">
          {loading ? (
            <View className="my-10 items-center justify-center">
              <ActivityIndicator size="large" color="#8b5cf6" />
            </View>
          ) : transactionsData.content.length > 0 ? (
            transactionsData.content.map((item: Transaction) => (
              <View
                key={item.id}
                className={`mx-6 mb-3 rounded-xl ${isDarkMode ? 'bg-gray-900/20' : 'bg-white'} p-4`}>
                <View className="flex-row items-center">
                  <View
                    className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
                    <Text>
                      <Octicons
                        name={getCategoryIcon(item.category)}
                        size={20}
                        color={styles.iconColor}
                      />
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className={`font-medium ${styles.textPrimary}`}>{item.label}</Text>
                    <Text className={`text-xs ${styles.textSecondary}`}>
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <Text
                    className={`font-semibold ${
                      item.type === 'Expense' ? 'text-red-500' : 'text-green-500'
                    }`}>
                    {item.type === 'Expense' ? '-' : '+'}${item.amount}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className={`mt-8 text-center ${styles.textMuted}`}>No transactions found.</Text>
          )}

          {transactionsData.totalPages > 0 && (
            <View className="mx-6 mt-6 flex-row items-center justify-between px-4">
              <TouchableOpacity
                className={`rounded-lg ${
                  isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                } px-4 py-2`}
                disabled={currentPage === 0}
                onPress={handlePreviousPage}>
                <Text className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  Previous
                </Text>
              </TouchableOpacity>

              <Text className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                Page {currentPage + 1} of {transactionsData.totalPages}
              </Text>

              <TouchableOpacity
                className={`rounded-lg ${
                  isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                } px-4 py-2`}
                disabled={currentPage === transactionsData.totalPages - 1}
                onPress={handleNextPage}>
                <Text className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
      />
    </SafeAreaView>
  );
};

export default Transactions;
