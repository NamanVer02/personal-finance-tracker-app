import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { User } from 'interfaces/dto';
import { useUser } from 'contexts/UserContext';

export default function Dashboard() {
  const { user } = useUser();

  if (!user) {
    return <Text>Loading user...</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView className="flex-1 p-4">

        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-2 pb-8">
          <View>
            <Text className="text-text-light text-sm">Welcome back</Text>
            <Text className="text-text text-3xl font-bold">{user.username}</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
            <Octicons name="bell" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View className="mx-4 p-6 bg-purple-500 rounded-2xl shadow-lg">
        <Text className="text-purple-200 text-base font-medium mb-2">Total Balance</Text>
        <Text className="text-white text-4xl font-bold mb-6">$8,246.57</Text>
        <View className="flex-row justify-between">
          <View className="flex-1 bg-purple-300/50 rounded-xl mr-2 p-4 items-center">
            <Text className="text-purple-100 text-xs mb-1">Income</Text>
            <Text className="text-white text-lg font-bold">$12,450.00</Text>
          </View>
          <View className="flex-1 bg-purple-300/50 rounded-xl ml-2 p-4 items-center">
            <Text className="text-purple-100 text-xs mb-1">Expenses</Text>
            <Text className="text-white text-lg font-bold">$4,203.43</Text>
          </View>
        </View>
      </View>


        {/* Quick Actions */}
        <View className="flex-row justify-between px-8 mt-10">
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
              <Octicons name="paper-airplane" size={20} color="#8b5cf6" />
            </View>
            <Text className="text-xs mt-1 text-gray-700">Send</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
              <Octicons name="plus" size={20} color="#8b5cf6" />
            </View>
            <Text className="text-xs mt-1 text-gray-700">Add</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
              <Octicons name="credit-card" size={20} color="#8b5cf6" />
            </View>
            <Text className="text-xs mt-1 text-gray-700">Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
              <Octicons name="note" size={20} color="#8b5cf6" />
            </View>
            <Text className="text-xs mt-1 text-gray-700">Loans</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View className="mt-14 px-4 mb-20">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Recent Transactions</Text>
            <TouchableOpacity>
              <Text className="text-text">See All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Transaction Items */}
          <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Octicons name="credit-card" size={20} color="#8b5cf6" />
              </View>
              <View className="flex-1">
                <Text className="font-medium">Amazon</Text>
                <Text className="text-xs text-gray-500">May 1, 2025</Text>
              </View>
              <Text className="font-semibold text-red-500">-$34.50</Text>
            </View>
          </View>
          
          <View className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Octicons name="paper-airplane" size={20} color="#8b5cf6" />
              </View>
              <View className="flex-1">
                <Text className="font-medium">Transfer to Sarah</Text>
                <Text className="text-xs text-gray-500">Apr 30, 2025</Text>
              </View>
              <Text className="font-semibold text-red-500">-$120.00</Text>
            </View>
          </View>
          
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <Octicons name="arrow-down" size={20} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="font-medium">Salary Deposit</Text>
                <Text className="text-xs text-gray-500">Apr 28, 2025</Text>
              </View>
              <Text className="font-semibold text-green-500">+$2,450.00</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center bg-white pt-2 pb-6 border-t border-gray-200">
        <TouchableOpacity className="items-center">
          <Octicons name="home" size={24} color="#8b5cf6" />
          <Text className="text-xs mt-1 text-purple-500">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Octicons name="graph" size={24} color="#9ca3af" />
          <Text className="text-xs mt-1 text-gray-400">Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Octicons name="credit-card" size={24} color="#9ca3af" />
          <Text className="text-xs mt-1 text-gray-400">Cards</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Octicons name="person" size={24} color="#9ca3af" />
          <Text className="text-xs mt-1 text-gray-400">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
