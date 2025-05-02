import "./global.css";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";

import Login from "screens/Login";
import Register from "screens/Register";
import Dashboard from "screens/Dashboard";
import type { RootStackParamList } from "./interfaces/types";
import { UserProvider, useUser } from "./contexts/UserContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppLoader() {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userString = await SecureStore.getItemAsync("user");
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
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
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
