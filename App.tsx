import './global.css';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native';
import Login from 'screens/Login';
import Register from 'screens/Register';
import Dashboard from 'screens/Dashboard';
import Profile from './screens/Profile';
import TabBar from './components/ui/TabBar';
import type { RootStackParamList } from './interfaces/types';
import { UserProvider, useUser } from './contexts/UserContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeWrapper from './components/ui/ThemeWrapper';
import Analytics from 'screens/Analytics';
import GoogleAuthSetup from 'screens/GoogleAuthSetup';
import ForgotPassword from 'screens/ForgotPassword';
import Transactions from './screens/Transactions';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BottomTab = createBottomTabNavigator();
// Bottom tab navigator component
function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, animation:'shift' }}>
      <BottomTab.Screen name="Dashboard" component={Dashboard} />
      <BottomTab.Screen name="Analytics" component={Analytics} />
      <BottomTab.Screen name="Transactions" component={Transactions} />
      <BottomTab.Screen name="Profile" component={Profile} />
    </BottomTab.Navigator>
  );
}

function AppLoader() {
  const { user, setUser } = useUser();
  const { isDarkMode } = useTheme();
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
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="GoogleAuthSetup"
          component={GoogleAuthSetup}
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <ThemeWrapper>
            <AppLoader />
          </ThemeWrapper>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
