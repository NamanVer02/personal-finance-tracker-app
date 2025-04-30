import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { CommonActions, useNavigation } from "@react-navigation/native";

export default function Dashboard() {
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch user data from AsyncStorage
    const fetchUser = async () => {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) setUser(JSON.parse(userJson));
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("user");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-accent-light rounded-custom p-8 items-center w-full max-w-[380px]">
          <Text className="text-accent text-3xl font-bold mb-2">🎉</Text>
          <Text className="text-text text-2xl font-bold mb-2">Login Successful!</Text>
          {user && (
            <>
              <Text className="text-text text-lg mb-1">
                Welcome, <Text className="font-semibold">{user.username}</Text>
              </Text>
              <Text className="text-text-light mb-1">{user.email}</Text>
              <Text className="text-text-light mb-4">
                Roles: {user.roles?.join(", ")}
              </Text>
            </>
          )}
          <TouchableOpacity
            className="bg-accent py-3 px-8 rounded-custom mt-4"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold text-base">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
