import React from 'react';
import { Modal, View, Text, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { Transaction } from 'interfaces/types';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';

interface DeleteTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: (transaction: Transaction) => void;
  transactionToDelete?: Transaction | null;
}

const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
  visible,
  onClose,
  onDelete,
  transactionToDelete,
}) => {
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();

  if (!transactionToDelete) return null;

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center bg-black/40">
          <View
            className={`w-11/12 max-w-md items-center rounded-2xl ${styles.bgSecondary} p-6 shadow-lg`}
            style={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }}>
            {/* Header */}
            <Text className={`mb-2 text-xl font-bold ${styles.textPrimary}`}>
              Delete Transaction
            </Text>

            {/* Confirmation Message */}
            <Text className={`mb-4 text-center text-base ${styles.textSecondary}`}>
              Are you sure you want to delete this transaction?
            </Text>

            {/* Transaction Details */}
            <View
              className={`mb-6 w-full flex-row items-center rounded-xl p-4`}
              style={{ backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }}>
              <View className="mr-4">
                <Text>
                  <Octicons
                    name={
                      transactionToDelete.category === 'Salary'
                        ? 'briefcase'
                        : transactionToDelete.category === 'Food & Drinks'
                          ? 'flame'
                          : 'credit-card'
                    }
                    size={28}
                    color="#8b5cf6"
                  />
                </Text>
              </View>
              <View className="flex-1">
                <Text className={`text-lg font-medium ${styles.textPrimary}`}>
                  {transactionToDelete.label}
                </Text>
                <Text className={`text-xs ${styles.textSecondary}`}>
                  {formatDate(transactionToDelete.date)}
                </Text>
                <Text className={`text-xs ${styles.textSecondary}`}>
                  {transactionToDelete.category}
                </Text>
              </View>
              <Text
                className={`text-lg font-semibold ${
                  transactionToDelete.type === 'Expense' ? 'text-red-500' : 'text-green-500'
                }`}>
                {transactionToDelete.type === 'Expense' ? '-' : '+'}${transactionToDelete.amount}
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="w-full flex-row justify-end gap-4 space-x-4">
              <TouchableOpacity
                onPress={onClose}
                className={`w-1/4 min-w-[76px] rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} px-2 py-3`}>
                <Text
                  className={`text-center font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onDelete(transactionToDelete);
                  onClose();
                }}
                className="w-1/4 min-w-[76px] rounded-xl bg-red-500 px-2 py-3">
                <Text className="text-center font-semibold text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default DeleteTransactionModal;
