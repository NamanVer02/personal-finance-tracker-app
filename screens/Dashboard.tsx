import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useUser } from 'contexts/UserContext';
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

export default function Dashboard() {
  const { user } = useUser();
  const swipeableRefs = useRef<{ [key: number]: Swipeable | null }>({});

  const [addTransactionModalVisible, setAddTransactionModalVisible] = useState(false);
  const [editTransactionModalVisible, setEditTransactionModalVisible] = useState(false);
  const [deleteTransactionModalVisible, setDeleteTransactionModalVisible] = useState(false);
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
    setTransactions(response);
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
      <Octicons name="pencil" size={20} color="#3B82F6" />
      <Text className="text-md ml-2 font-bold text-blue-900">Edit</Text>
    </TouchableOpacity>
  );

  const renderRightActions = () => (
    <TouchableOpacity className="flex-1 flex-row-reverse items-center pr-6">
      <Octicons name="trash" size={20} color="#EF4444" />
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
    <SafeAreaView className="flex-1 bg-gray-50">
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

      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-8 pt-2">
          <View>
            <Text className="text-sm text-text-light">Welcome back</Text>
            <Text className="text-3xl font-bold text-text">{user.username}</Text>
          </View>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Octicons name="bell" size={20} color="#6b7280" />
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
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Octicons name="sync" size={20} color="#8b5cf6" />
            </View>
            <Text className="mt-1 text-xs text-gray-700">Sync</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center"
            onPress={() => setAddTransactionModalVisible(true)}>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Octicons name="plus" size={20} color="#8b5cf6" />
            </View>
            <Text className="mt-1 text-xs text-gray-700">Add</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Octicons name="credit-card" size={20} color="#8b5cf6" />
            </View>
            <Text className="mt-1 text-xs text-gray-700">Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Octicons name="note" size={20} color="#8b5cf6" />
            </View>
            <Text className="mt-1 text-xs text-gray-700">Loans</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View className="mb-20 mt-14 px-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold">Recent Transactions</Text>
            <TouchableOpacity>
              <Text className="text-text">See All</Text>
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
                    <View className="mb-3 rounded-xl bg-white p-4 shadow-sm">
                      <View className="flex-row items-center">
                        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                          <Octicons
                            name={
                              item.category === 'Salary'
                                ? 'briefcase'
                                : item.category === 'Food & Drinks'
                                  ? 'flame'
                                  : 'credit-card'
                            }
                            size={20}
                            color="#8b5cf6"
                          />
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
                  </Swipeable>
                ))
              ) : (
                <Text className="mt-8 text-center text-gray-400">No transactions found.</Text>
              )}
            </View>
          </GestureHandlerRootView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
