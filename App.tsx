import './global.css';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native';
import Login from 'screens/Login';
import Register from 'screens/Register';
import Dashboard from 'screens/Dashboard';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import TabBar from './components/ui/TabBar';
import type { RootStackParamList } from './interfaces/types';
import { UserProvider, useUser } from './contexts/UserContext';
import Analytics from 'screens/Analytics';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator();
// Bottom tab navigator component
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <BottomTab.Screen name="Dashboard" component={Dashboard} />
      <BottomTab.Screen name="Analytics" component={Analytics} />
      <BottomTab.Screen name="Transactions" component={SettingsScreen} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} />
    </BottomTab.Navigator>
  );
}

function AppLoader() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userString = await SecureStore.getItemAsync('user');
      if (userString) {
        setUser(JSON.parse(userString));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <AppLoader />
      </UserProvider>
    </SafeAreaProvider>
  );
}
