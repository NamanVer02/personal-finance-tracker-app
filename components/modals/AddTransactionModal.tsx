import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Category, AddTransactionModalProps, Transaction } from 'interfaces/types';
import { addTransaction } from 'services/transactionService';

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ visible, onClose, onSave }) => {
  const [transactionType, setTransactionType] = useState<'Expense' | 'Income'>('Expense');
  const [label, setLabel] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<Category | null>(null);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  // Categories based on transaction type
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

  const currentCategories = transactionType === 'Expense' ? expenseCategories : incomeCategories;

  const handleSave = (): void => {
    if (!label || !amount || !category) {
      // Validate fields
      alert('Please fill all required fields');
      return;
    }

    const transaction: Transaction = {
      type: transactionType,
      label,
      amount: parseFloat(amount),
      category,
      date,
    };

    addTransaction(transaction);

    // Reset form
    setTransactionType('Expense');
    setLabel('');
    setAmount('');
    setCategory(null);
    setDate(new Date());
    onClose();
  };

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

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-4/5 rounded-t-3xl bg-white p-6">
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-800">Add Transaction</Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Octicons name="x" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Transaction Type Selector */}
              <View className="mb-6 flex-row rounded-xl bg-gray-100 p-1">
                <TouchableOpacity
                  onPress={() => setTransactionType('Expense')}
                  className={`flex-1 rounded-lg py-3 ${
                    transactionType === 'Expense' ? 'bg-purple-500' : 'bg-transparent'
                  }`}>
                  <Text
                    className={`text-center font-medium ${
                      transactionType === 'Expense' ? 'text-white' : 'text-gray-500'
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
                      transactionType === 'Income' ? 'text-white' : 'text-gray-500'
                    }`}>
                    Income
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Amount Field */}
              <View className="mb-6">
                <Text className="mb-2 text-sm text-gray-500">Amount</Text>
                <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
                  <Text className="text mr-2 text-gray-500">$</Text>
                  <TextInput
                    className="text flex-1"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Transaction Label */}
              <View className="mb-6">
                <Text className="mb-2 text-sm text-gray-500">Label</Text>
                <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
                  <TextInput
                    className="flex-1"
                    value={label}
                    onChangeText={setLabel}
                    placeholder="What's this transaction for?"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Category Dropdown */}
              <View className="mb-6">
                <Text className="mb-2 text-sm text-gray-500">Category</Text>
                <TouchableOpacity
                  onPress={() => setShowCategories(!showCategories)}
                  className="text flex-row items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                  {category ? (
                    <View className="flex-row items-center">
                      <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                        <Octicons name={category.icon} size={16} color="#8b5cf6" />
                      </View>
                      <Text>{category.name}</Text>
                    </View>
                  ) : (
                    <Text className="text-gray-400">Select a category</Text>
                  )}
                  <Octicons
                    name={showCategories ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>

                {/* Category List */}
                {showCategories && (
                  <View className="text mt-2 rounded-xl border border-gray-100 bg-white shadow-sm">
                    {currentCategories.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => {
                          setCategory(cat);
                          setShowCategories(false);
                        }}
                        className="flex-row items-center border-b border-gray-100 p-3 ">
                        <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                          <Octicons name={cat.icon} size={16} color="#8b5cf6" />
                        </View>
                        <Text>{cat.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Date Field */}
              <View className="mb-6">
                <Text className="mb-2 text-sm text-gray-500">Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="text flex-row items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                  <Text className="text">{formatDate(date)}</Text>
                  <Octicons name="calendar" size={20} color="#6b7280" />
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>
            </ScrollView>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} className="mt-4 rounded-xl bg-purple-500 py-4">
              <Text className="text-center text-lg font-semibold text-white">Save Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddTransactionModal;
