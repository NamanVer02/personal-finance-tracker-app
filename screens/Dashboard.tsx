import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather, AntDesign, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const transactions = [
  {
    id: '1',
    name: 'Upwork',
    icon: <FontAwesome name="arrow-up" size={28} color="#6fda44" style={{ marginRight: 10 }} />,
    date: 'Today',
    amount: 850,
    type: 'income',
  },
  {
    id: '2',
    name: 'Transfur',
    icon: <FontAwesome name="user" size={28} color="#888" style={{ marginRight: 10 }} />,
    date: 'Monday',
    amount: -85,
    type: 'expense',
  },
  {
    id: '3',
    name: 'Paypal',
    icon: <FontAwesome name="paypal" size={28} color="#003087" style={{ marginRight: 10 }} />,
    date: 'Jan 20, 2022',
    amount: 1406,
    type: 'income',
  },
  {
    id: '4',
    name: 'YouTube',
    icon: <FontAwesome name="youtube-play" size={28} color="#ff0000" style={{ marginRight: 10 }} />,
    date: 'Jan 16, 2022',
    amount: -11.99,
    type: 'expense',
  },
];

const sendAgain = [
  { id: 1, initials: 'AB', color: '#a084fa' },
  { id: 2, initials: 'JS', color: '#8f5cf7' },
  { id: 3, initials: '😊', color: '#ffd700' },
  { id: 4, initials: 'RK', color: '#6fda44' },
  { id: 5, initials: 'MG', color: '#ffb347' },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[rgb(var(--bg))]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Gradient */}
        <LinearGradient
          colors={['#a084fa', '#8f5cf7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.7 }}
          style={{
            paddingBottom: 36,
            paddingTop: 32,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View className="flex-row justify-between items-center mb-4.5">
            <View>
              <Text className="text-white text-xs opacity-80">Good afternoon,</Text>
              <Text className="text-white font-bold text-xl mt-0.5">David Smith</Text>
            </View>
            <TouchableOpacity>
              <MaterialIcons name="notifications-none" size={26} color="white" style={{ opacity: 0.8 }} />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View className="bg-white/15 rounded-2xl p-5 shadow-md">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white text-sm opacity-80 font-medium">Total Balance</Text>
              <TouchableOpacity>
                <Feather name="more-horizontal" size={20} color="#fff" style={{ opacity: 0.8 }} />
              </TouchableOpacity>
            </View>
            <Text className="text-white text-3xl font-bold mb-2.5">$2,548.00</Text>
            <View className="flex-row justify-between mt-2.5">
              <View className="items-center">
                <Text className="text-white text-xs opacity-70">Income</Text>
                <Text className="text-white text-lg font-semibold mt-0.5">$1,840.00</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-xs opacity-70">Expenses</Text>
                <Text className="text-white text-lg font-semibold mt-0.5">$284.00</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Transactions History */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-bold text-base text-[rgb(var(--text))]">Transactions History</Text>
            <TouchableOpacity>
              <Text className="text-[rgb(var(--accent))] text-xs font-medium">See all</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white rounded-xl py-0.5 px-0 shadow-sm">
            {transactions.map(txn => (
              <View
                key={txn.id}
                className="flex-row justify-between items-center py-4 px-4.5 border-b border-b-[#f2f2f2]"
              >
                <View className="flex-row items-center">
                  {txn.icon}
                  <View>
                    <Text className="font-semibold text-sm text-[rgb(var(--text))]">{txn.name}</Text>
                    <Text className="text-xs text-[rgb(var(--text-light))] mt-0.5">{txn.date}</Text>
                  </View>
                </View>
                <Text
                  className={[
                    'font-bold text-sm',
                    txn.type === 'income'
                      ? 'text-[#2ecc71]'
                      : 'text-[#e74c3c]',
                  ].join(' ')}
                >
                  {txn.type === 'income' ? '+' : '-'} ${Math.abs(txn.amount).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Send Again */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-bold text-base text-[rgb(var(--text))]">Send Again</Text>
            <TouchableOpacity>
              <Text className="text-[rgb(var(--accent))] text-xs font-medium">See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
            {sendAgain.map((item) => (
              <View
                key={item.id}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginRight: 14,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: item.color,
                }}
              >
                <Text className="text-white font-bold text-lg">
                  {item.initials}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 34,
          left: width / 2 - 32,
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: 'rgb(var(--accent))',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8,
          shadowColor: '#8f5cf7',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.32,
          shadowRadius: 8,
          zIndex: 10,
        }}
      >
        <AntDesign name="plus" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View
  className="absolute left-0 right-0 flex-row items-center justify-around bg-white border-t border-t-[#f2f2f2] px-3 z-10"
  style={{ bottom: 0, height: 68 }}
>
  <TouchableOpacity className="flex-1 items-center justify-center">
    <AntDesign name="home" size={24} color="#8f5cf7" />
  </TouchableOpacity>
  <TouchableOpacity className="flex-1 items-center justify-center">
    <Feather name="bar-chart-2" size={24} color="#b3b3b3" />
  </TouchableOpacity>
  <View style={{ width: 64 }} /> {/* FAB Spacer */}
  <TouchableOpacity className="flex-1 items-center justify-center">
    <Feather name="credit-card" size={24} color="#b3b3b3" />
  </TouchableOpacity>
  <TouchableOpacity className="flex-1 items-center justify-center">
    <FontAwesome name="user-o" size={24} color="#b3b3b3" />
  </TouchableOpacity>
</View>

    </SafeAreaView>
  );
}
