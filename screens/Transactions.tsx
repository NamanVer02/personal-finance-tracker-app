import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { fetchAllTransactions } from 'services/transactionService';
import { useNavigation } from '@react-navigation/native';
import { Transaction } from 'interfaces/types';

const Transactions = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [transactionsData, setTransactionsData] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    totalElements: 0,
  });
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based indexing

  useEffect(() => {
    loadTransactions();
  }, [currentPage]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetchAllTransactions({ page: currentPage });
      setTransactionsData(response);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="mb-6 mt-4">
          {/* Header */}
          <View className="mb-6 flex-row items-center justify-between px-4">
            <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
              <Octicons name="arrow-left" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">All Transactions</Text>
            <TouchableOpacity className="p-2" onPress={loadTransactions}>
              <Octicons name="sync" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="my-10 items-center justify-center">
              <ActivityIndicator size="large" color="#8b5cf6" />
            </View>
          ) : transactionsData.content.length > 0 ? (
            transactionsData.content.map((item: Transaction) => (
              <View key={item.id} className="mx-6 mb-3 rounded-xl bg-white p-4">
                <View className="flex-row items-center">
                  <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Octicons name={getCategoryIcon(item.category)} size={20} color="#8b5cf6" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium">{item.label}</Text>
                    <Text className="text-xs text-gray-500">
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
            <Text className="mt-8 text-center text-gray-400">No transactions found.</Text>
          )}

          {transactionsData.totalPages > 0 && (
            <View className="mx-6 mt-6 flex-row items-center justify-between px-4">
              <TouchableOpacity
                className="rounded-lg bg-purple-100 px-4 py-2"
                disabled={currentPage === 0}
                onPress={handlePreviousPage}>
                <Text className={`${currentPage === 0 ? 'text-gray-400' : 'text-purple-600'}`}>
                  Previous
                </Text>
              </TouchableOpacity>

              <Text className="text-gray-600">
                Page {currentPage + 1} of {transactionsData.totalPages}
              </Text>

              <TouchableOpacity
                className="rounded-lg bg-purple-100 px-4 py-2"
                disabled={currentPage === transactionsData.totalPages - 1}
                onPress={handleNextPage}>
                <Text
                  className={`${currentPage === transactionsData.totalPages - 1 ? 'text-gray-400' : 'text-purple-600'}`}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Transactions;
