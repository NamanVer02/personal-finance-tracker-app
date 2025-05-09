import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useUser } from 'contexts/UserContext';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';
import { ActivityIndicator } from 'react-native';
import AddTransactionModal from 'components/modals/AddTransactionModal';
import { useEffect, useState, useRef } from 'react';
import { fetchTransactions } from 'services/transactionService';
import { Transaction, FinanceDetails } from 'interfaces/types';
import { TransactionResponseDTO } from 'interfaces/dto';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import EditTransactionModal from 'components/modals/EditTransactionModal';
import DeleteTransactionModal from 'components/modals/DeleteTransactionModal';
import { deleteTransaction, fetchFinanceDetails } from 'services/transactionService';
import ThemeToggle from 'components/ui/theme-toggle';
import { useNavigation } from '@react-navigation/native';
import CsvUploadModal from 'components/modals/CsvUploadModal';

export default function Dashboard() {
  const { user } = useUser();
  const styles = useThemeStyles();
  const navigation = useNavigation();
  const swipeableRefs = useRef<{ [key: number]: Swipeable | null }>({});

  const [addTransactionModalVisible, setAddTransactionModalVisible] = useState(false);
  const [editTransactionModalVisible, setEditTransactionModalVisible] = useState(false);
  const [deleteTransactionModalVisible, setDeleteTransactionModalVisible] = useState(false);
  const [csvuploadModal, setCsvuploadModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionResponseDTO | null>(null);
  const [financeDetails, setFinanceDetails] = useState<FinanceDetails | null>(null);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [swipedId, setSwipedId] = useState<number | null>(null);

  const handleSaveTransaction = (transaction: Transaction) => {
    setTransactions((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: [transaction, ...prev.content],
        totalElements: prev.totalElements + 1,
        numberOfElements: prev.numberOfElements + 1,
        empty: false,
      };
    });
  };

  const handleSyncData = async () => {
    const response = await fetchTransactions();
    const response2 = await fetchFinanceDetails();
    setTransactions(response);
    setFinanceDetails(response2);
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: prev.content.map((tx) =>
          tx.id === updatedTransaction.id ? updatedTransaction : tx
        ),
      };
    });
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    try {
      await deleteTransaction(transaction.id);

      setTransactions((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.filter((tx) => tx.id !== transaction.id),
        };
      });
    } catch (error) {
      alert('Failed to delete transaction. Please try again.');
    }
  };

  const renderLeftActions = () => (
    <TouchableOpacity className="flex-1 flex-row items-center pl-6">
      <Text>
        <Octicons name="pencil" size={20} color="#3B82F6" />
      </Text>
      <Text className="text-md ml-2 font-bold text-blue-900">Edit</Text>
    </TouchableOpacity>
  );

  const renderRightActions = () => (
    <TouchableOpacity className="flex-1 flex-row-reverse items-center pr-6">
      <Text>
        <Octicons name="trash" size={20} color="#EF4444" />
      </Text>
      <Text className="text-md mr-2 font-bold text-red-900">Delete</Text>
    </TouchableOpacity>
  );

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTransactions();
        setTransactions(response);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }

      try {
        const response = await fetchFinanceDetails();
        setFinanceDetails(response);
      } catch (error) {
        console.error('Error fetching finance details:', error);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${styles.bgPrimary}`}>
      <AddTransactionModal
        visible={addTransactionModalVisible}
        onClose={() => setAddTransactionModalVisible(false)}
        onSave={handleSaveTransaction}
      />

      <EditTransactionModal
        visible={editTransactionModalVisible}
        onClose={() => {
          setEditTransactionModalVisible(false);
          if (swipedId !== null && swipeableRefs.current[swipedId]) {
            swipeableRefs.current[swipedId]?.close();
            setSwipedId(null);
          }
        }}
        onEdit={handleEditTransaction}
        onSave={handleSaveTransaction}
        transactionToEdit={transactionToEdit}
      />

      <DeleteTransactionModal
        visible={deleteTransactionModalVisible}
        onClose={() => {
          setDeleteTransactionModalVisible(false);
          if (swipedId !== null && swipeableRefs.current[swipedId]) {
            swipeableRefs.current[swipedId]?.close();
            setSwipedId(null);
          }
        }}
        onDelete={handleDeleteTransaction}
        transactionToDelete={transactionToDelete}
      />

      <CsvUploadModal
        visible={csvuploadModal}
        onClose={() => setCsvuploadModal(false)}
        onUploadSuccess={handleSyncData}
      />

      <StatusBar barStyle={styles.statusBarStyle} backgroundColor={styles.statusBarBgColor} />
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-8 pt-2">
          <View className="flex-row items-center">
            <View
              className={`mr-3 h-12 w-12 overflow-hidden rounded-full border ${styles.borderColor}`}>
              {user.profileImage ? (
                <Image
                  source={{ uri: `data:image/png;base64,${user.profileImage}` }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center bg-accent">
                  <Text className="font-bold text-white">
                    {user.username.substring(0, 2).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View>
              <Text className={`text-sm ${styles.textSecondary}`}>Welcome back</Text>
              <Text className={`text-3xl font-bold ${styles.textPrimary}`}>{user.username}</Text>
            </View>
          </View>
          <TouchableOpacity
            className={`h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
            <Text>
              <Octicons name="bell" size={20} color={styles.iconColor} />
            </Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View className="mx-4 rounded-2xl bg-purple-500 p-6 shadow-lg">
          <Text className="mb-2 text-base font-medium text-purple-200">Total Balance</Text>
          <Text className="mb-6 text-4xl font-bold text-white">{`$${financeDetails?.total_balance}`}</Text>
          <View className="flex-row justify-between">
            <View className="mr-2 flex-1 items-center rounded-xl bg-purple-300/50 p-4">
              <Text className="mb-1 text-xs text-purple-100">Income</Text>
              <Text className="text-lg font-bold text-white">{`$${financeDetails?.total_income}`}</Text>
            </View>
            <View className="ml-2 flex-1 items-center rounded-xl bg-purple-300/50 p-4">
              <Text className="mb-1 text-xs text-purple-100">Expenses</Text>
              <Text className="text-lg font-bold text-white">{`$${financeDetails?.total_expense}`}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mt-10 flex-row justify-between px-8">
          <TouchableOpacity className="items-center" onPress={handleSyncData}>
            <View className={`h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
              <Text>
                <Octicons name="sync" size={20} color={styles.iconColor} />
              </Text>
            </View>
            <Text className={`mt-1 text-xs ${styles.textPrimary}`}>Sync</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center"
            onPress={() => setAddTransactionModalVisible(true)}>
            <View className={`h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
              <Text>
                <Octicons name="plus" size={20} color={styles.iconColor} />
              </Text>
            </View>
            <Text className={`mt-1 text-xs ${styles.textPrimary}`}>Add</Text>
          </TouchableOpacity>
          <ThemeToggle compact></ThemeToggle>
          <TouchableOpacity className="items-center" onPress={() => setCsvuploadModal(true)}>
            <View className={`h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
              <Text>
                <Octicons name="upload" size={20} color={styles.iconColor} />
              </Text>
            </View>
            <Text className={`mt-1 text-xs ${styles.textPrimary}`}>Upload</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View className="mb-20 mt-14 px-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className={`text-lg font-semibold ${styles.textPrimary}`}>
              Recent Transactions
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Transactions');
              }}>
              <Text className={styles.textPrimary}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Transactions List */}
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="mt-4">
              {transactions ? (
                transactions.content.map((item) => (
                  <Swipeable
                    key={item.id}
                    ref={(ref) => {
                      swipeableRefs.current[item.id] = ref;
                    }}
                    leftThreshold={50}
                    rightThreshold={50}
                    renderLeftActions={renderLeftActions}
                    renderRightActions={renderRightActions}
                    onSwipeableOpen={(direction) => {
                      if (direction === 'left') {
                        setTransactionToEdit(item);
                        setEditTransactionModalVisible(true);
                        setSwipedId(item.id);
                      } else if (direction === 'right') {
                        setTransactionToDelete(item);
                        setDeleteTransactionModalVisible(true);
                        setSwipedId(item.id);
                      }
                    }}>
                    <View className={`mb-3 rounded-xl ${styles.bgSecondary} p-4`}>
                      <View className="flex-row items-center">
                        <View
                          className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
                          <Text>
                            <Octicons
                              name={
                                item.category === 'Salary'
                                  ? 'briefcase'
                                  : item.category === 'Food & Drinks'
                                    ? 'flame'
                                    : 'credit-card'
                              }
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
                  </Swipeable>
                ))
              ) : (
                <Text className={`mt-8 text-center ${styles.textSecondary}`}>
                  No transactions found.
                </Text>
              )}
            </View>
          </GestureHandlerRootView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
