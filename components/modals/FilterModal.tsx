import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Pressable,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';
import { FetchAllTransactionParams } from 'interfaces/types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FetchAllTransactionParams;
  onApplyFilters: (filters: FetchAllTransactionParams) => void;
  onResetFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();

  // Local state to track filters before applying
  const [localFilters, setLocalFilters] = useState<FetchAllTransactionParams>(filters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Transaction type and category lists
  const transactionTypes = ['', 'Income', 'Expense'];
  const transactionCategories = [
    '',
    // Income categories
    'Salary',
    'Investments',
    'Gifts',
    'Refunds',
    // Expense categories
    'Food & Drinks',
    'Shopping',
    'Transportation',
    'Bills',
    'Entertainment',
    'Health',
    'Education',
    'Other',
  ];

  // Reset local filters when modal opens with new filters
  React.useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  const updateFilterField = (field: string, value: any) => {
    if (value === '' || value === null) {
      const newFilters = { ...localFilters };
      delete newFilters[field as keyof FetchAllTransactionParams];
      setLocalFilters(newFilters);
    } else {
      setLocalFilters((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    setLocalFilters({});
    onResetFilters();
    onClose();
  };

  const formatDateForDisplay = (date: Date | string | undefined) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
  };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <View className="flex-1 justify-end bg-black/50">
            <View
              className={`rounded-t-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} pb-6`}
              style={{ maxHeight: '80%' }}>
              <View className="px-6 pt-6">
                {/* Header */}
                <View className="mb-6 flex-row items-center justify-between">
                  <Text className={`text-xl font-bold ${styles.textPrimary}`}>
                    Filter Transactions
                  </Text>
                  <TouchableOpacity onPress={onClose}>
                    <Octicons name="x" size={24} color={isDarkMode ? '#d1d5db' : '#6b7280'} />
                  </TouchableOpacity>
                </View>

                <ScrollView className="max-h-96">
                  {/* Type Filter */}
                  <View className="mb-4">
                    <Text className={`mb-2 font-semibold ${styles.textPrimary}`}>
                      Transaction Type
                    </Text>
                    <View className="flex-row flex-wrap">
                      {transactionTypes.map((type) => (
                        <TouchableOpacity
                          key={type || 'all'}
                          onPress={() => updateFilterField('type', type)}
                          className={`mb-2 mr-2 rounded-full px-4 py-2 ${
                            localFilters.type === type ? 'bg-purple-600' : styles.bgSecondary
                          }`}>
                          <Text
                            className={
                              localFilters.type === type ? 'text-white' : styles.textPrimary
                            }>
                            {type || 'All Types'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Category Filter */}
                  <View className="mb-4">
                    <Text className={`mb-2 font-semibold ${styles.textPrimary}`}>Category</Text>
                    <View className="flex-row flex-wrap">
                      {transactionCategories.map((category) => (
                        <TouchableOpacity
                          key={category || 'all'}
                          onPress={() => updateFilterField('category', category)}
                          className={`mb-2 mr-2 rounded-full px-4 py-2 ${
                            localFilters.category === category
                              ? 'bg-purple-600'
                              : styles.bgSecondary
                          }`}>
                          <Text
                            className={
                              localFilters.category === category ? 'text-white' : styles.textPrimary
                            }>
                            {category || 'All Categories'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Amount Range */}
                  <View className="mb-4">
                    <Text className={`mb-2 font-semibold ${styles.textPrimary}`}>Amount Range</Text>
                    <View className="flex-row">
                      <View className="mr-2 flex-1">
                        <Text className={`mb-1 text-xs ${styles.textSecondary}`}>Min Amount</Text>
                        <TextInput
                          value={localFilters.minAmount?.toString() || ''}
                          onChangeText={(text) => {
                            const value = text.trim() === '' ? '' : parseFloat(text);
                            updateFilterField('minAmount', value);
                          }}
                          placeholder="Min"
                          keyboardType="numeric"
                          className={`rounded-lg p-3 ${styles.bgSecondary} ${styles.textPrimary}`}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className={`mb-1 text-xs ${styles.textSecondary}`}>Max Amount</Text>
                        <TextInput
                          value={localFilters.maxAmount?.toString() || ''}
                          onChangeText={(text) => {
                            const value = text.trim() === '' ? '' : parseFloat(text);
                            updateFilterField('maxAmount', value);
                          }}
                          placeholder="Max"
                          keyboardType="numeric"
                          className={`rounded-lg p-3 ${styles.bgSecondary} ${styles.textPrimary}`}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Date Range */}
                  <View className="mb-4">
                    <Text className={`mb-2 font-semibold ${styles.textPrimary}`}>Date Range</Text>
                    <View className="flex-row">
                      <View className="mr-2 flex-1">
                        <Text className={`mb-1 text-xs ${styles.textSecondary}`}>Start Date</Text>
                        <Pressable
                          onPress={() => setShowStartDatePicker(true)}
                          className={`rounded-lg p-3 ${styles.bgSecondary}`}>
                          <Text className={styles.textPrimary}>
                            {localFilters.startDate
                              ? formatDateForDisplay(localFilters.startDate)
                              : 'Select date'}
                          </Text>
                        </Pressable>
                      </View>
                      <View className="flex-1">
                        <Text className={`mb-1 text-xs ${styles.textSecondary}`}>End Date</Text>
                        <Pressable
                          onPress={() => setShowEndDatePicker(true)}
                          className={`rounded-lg p-3 ${styles.bgSecondary}`}>
                          <Text className={styles.textPrimary}>
                            {localFilters.endDate
                              ? formatDateForDisplay(localFilters.endDate)
                              : 'Select date'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>

                  {/* Search Term */}
                  <View className="mb-6">
                    <Text className={`mb-2 font-semibold ${styles.textPrimary}`}>Search</Text>
                    <TextInput
                      value={localFilters.searchTerm || ''}
                      onChangeText={(text) => updateFilterField('searchTerm', text)}
                      placeholder="Search transactions"
                      className={`rounded-lg p-3 ${styles.bgSecondary} ${styles.textPrimary}`}
                      placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
                    />
                  </View>
                </ScrollView>

                {/* Action Buttons */}
                <View className="mt-6 flex-row">
                  <TouchableOpacity
                    onPress={handleResetFilters}
                    className="mr-2 flex-1 items-center rounded-lg border border-purple-600 py-3">
                    <Text className="font-medium text-purple-600">Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleApplyFilters}
                    className="flex-1 items-center rounded-lg bg-purple-600 py-3">
                    <Text className="font-medium text-white">Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={localFilters.startDate ? new Date(localFilters.startDate) : new Date()}
          mode="date"
          display={'default'}
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate && event.type !== 'dismissed') {
              updateFilterField('startDate', selectedDate.toISOString().split('T')[0]);
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={localFilters.endDate ? new Date(localFilters.endDate) : new Date()}
          mode="date"
          display={'default'}
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate && event.type !== 'dismissed') {
              updateFilterField('endDate', selectedDate.toISOString().split('T')[0]);
            }
          }}
        />
      )}
    </>
  );
};

export default FilterModal;
