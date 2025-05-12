// EditTransactionModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category, Transaction } from 'interfaces/types';
import { AddTransactionModalProps } from 'interfaces/props';
import { updateTransaction } from 'services/transactionService';
import { TransactionDTO } from 'interfaces/dto';
import BaseModal from './BaseModal';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';

interface EditTransactionModalProps extends AddTransactionModalProps {
  transactionToEdit?: Transaction | null;
  onEdit: (updated: Transaction) => void;
}

const expenseCategories: Category[] = [
  { id: 1, name: 'Food & Drinks', icon: 'flame' },
  { id: 2, name: 'Shopping', icon: 'package' },
  { id: 3, name: 'Transportation', icon: 'rocket' },
  { id: 4, name: 'Bills', icon: 'note' },
  { id: 5, name: 'Entertainment', icon: 'device-camera-video' },
  { id: 6, name: 'Health', icon: 'pulse' },
  { id: 7, name: 'Education', icon: 'book' },
  { id: 8, name: 'Other', icon: 'ellipsis' },
];

const incomeCategories: Category[] = [
  { id: 1, name: 'Salary', icon: 'briefcase' },
  { id: 2, name: 'Investments', icon: 'graph' },
  { id: 3, name: 'Gifts', icon: 'gift' },
  { id: 4, name: 'Refunds', icon: 'arrow-switch' },
  { id: 5, name: 'Other', icon: 'ellipsis' },
];

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  visible,
  onClose,
  transactionToEdit,
  onEdit,
}) => {
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();
  const [transactionType, setTransactionType] = useState<'Expense' | 'Income'>('Expense');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setTransactionType(transactionToEdit.type as 'Expense' | 'Income');
      setLabel(transactionToEdit.label);
      setAmount(transactionToEdit.amount.toString());

      const categories =
        transactionToEdit.type === 'Expense' ? expenseCategories : incomeCategories;
      const foundCategory = categories.find((cat) => cat.name === transactionToEdit.category);
      setCategory(foundCategory || null);

      setDate(
        transactionToEdit.date instanceof Date
          ? transactionToEdit.date
          : new Date(transactionToEdit.date)
      );
    }
  }, [transactionToEdit, visible]);

  const currentCategories = transactionType === 'Expense' ? expenseCategories : incomeCategories;

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date): void => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSave = async () => {
    if (!label || !amount || !category) {
      alert('Please fill all required fields');
      return;
    }
    if (transactionToEdit) {
      try {
        // Prepare DTO for the API
        const updatedDTO: TransactionDTO = {
          type: transactionType,
          label,
          amount: parseFloat(amount),
          category: category.name,
          date: date.toISOString().split('T')[0],
        };
        // Call your update API
        const updatedTransaction = await updateTransaction(transactionToEdit.id, updatedDTO);
        // Pass updated transaction to parent
        onEdit(updatedTransaction);
      } catch (error) {
        alert('Failed to update transaction. Please try again.');
        return;
      }
    }

    onClose();
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Edit Transaction"
      actionButton={{
        label: 'Save Changes',
        onPress: handleSave,
      }}>
      {/* Transaction Type Selector */}
      <View
        className={`mb-6 flex-row rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-1`}>
        <TouchableOpacity
          onPress={() => setTransactionType('Expense')}
          className={`flex-1 rounded-lg py-3 ${
            transactionType === 'Expense' ? 'bg-purple-500' : 'bg-transparent'
          }`}>
          <Text
            className={`text-center font-medium ${
              transactionType === 'Expense'
                ? 'text-white'
                : isDarkMode
                  ? 'text-gray-300'
                  : 'text-gray-500'
            }`}>
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTransactionType('Income')}
          className={`flex-1 rounded-lg py-3 ${
            transactionType === 'Income' ? 'bg-purple-500' : 'bg-transparent'
          }`}>
          <Text
            className={`text-center font-medium ${
              transactionType === 'Income'
                ? 'text-white'
                : isDarkMode
                  ? 'text-gray-300'
                  : 'text-gray-500'
            }`}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amount Field */}
      <View className="mb-6">
        <Text className={`mb-2 text-sm ${styles.textSecondary}`}>Amount</Text>
        <View className={`flex-row items-center rounded-xl ${styles.bgInput} px-4 py-3`}>
          <Text className={`mr-2 ${styles.textSecondary}`}>$</Text>
          <TextInput
            className={`flex-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
          />
        </View>
      </View>

      {/* Transaction Label */}
      <View className="mb-6">
        <Text className={`mb-2 text-sm ${styles.textSecondary}`}>Label</Text>
        <View className={`flex-row items-center rounded-xl ${styles.bgInput} px-4 py-3`}>
          <TextInput
            className={`flex-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            value={label}
            onChangeText={setLabel}
            placeholder="What's this transaction for?"
            placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
          />
        </View>
      </View>

      {/* Category Dropdown */}
      <View className="mb-6">
        <Text className={`mb-2 text-sm ${styles.textSecondary}`}>Category</Text>
        <TouchableOpacity
          onPress={() => setShowCategories(!showCategories)}
          className={`flex-row items-center justify-between rounded-xl ${styles.bgInput} px-4 py-3`}>
          {category ? (
            <View className="flex-row items-center">
              <View
                className={`mr-3 h-8 w-8 items-center justify-center rounded-full ${styles.iconBg}`}>
                <Text>
                  <Octicons name={category.icon} size={16} color={styles.iconColor} />
                </Text>
              </View>
              <Text className={styles.textPrimary}>{category.name}</Text>
            </View>
          ) : (
            <Text className={styles.textMuted}>Select a category</Text>
          )}
          <Text>
            <Octicons
              name={showCategories ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={isDarkMode ? '#d1d5db' : '#6b7280'}
            />
          </Text>
        </TouchableOpacity>

        {/* Category List */}
        {showCategories && (
          <View
            className={`mt-2 rounded-xl border ${styles.borderColor} ${isDarkMode ? 'bg-gray-900/20' : 'bg-white'} shadow-sm`}>
            {currentCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setCategory(cat);
                  setShowCategories(false);
                }}
                className={`flex-row items-center border-b ${styles.borderColor} p-3`}>
                <View
                  className={`mr-3 h-8 w-8 items-center justify-center rounded-full ${styles.iconBg}`}>
                  <Text>
                    <Octicons name={cat.icon} size={16} color={styles.iconColor} />
                  </Text>
                </View>
                <Text className={styles.textPrimary}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Date Field */}
      <View className="mb-6">
        <Text className={`mb-2 text-sm ${styles.textSecondary}`}>Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className={`flex-row items-center justify-between rounded-xl ${styles.bgInput} px-4 py-3`}>
          <Text className={styles.textPrimary}>{formatDate(date)}</Text>
          <Text>
            <Octicons name="calendar" size={20} color={isDarkMode ? '#d1d5db' : '#6b7280'} />
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            themeVariant={isDarkMode ? 'dark' : 'light'}
          />
        )}
      </View>
    </BaseModal>
  );
};

export default EditTransactionModal;
