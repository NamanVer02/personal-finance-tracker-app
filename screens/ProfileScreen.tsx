import React, { useEffect, useState } from 'react';
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
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator } from 'react-native';
import { logout } from 'services/authService';
import { User } from 'interfaces/types';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  
  const handleLogout = async () => {
    const response = await logout();
    if (response.ok) {
      setUser(null);

      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}]
      })
    } else {
      console.error('Logout failed:', response.error);
    }
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-base text-red-500">User not found. Please login again.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between px-1">
          <TouchableOpacity className="p-2">
            <Octicons name="arrow-left" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Profile</Text>
          <TouchableOpacity className="p-2">
            <Octicons name="gear" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Image and Name */}
        <View className="relative mt-5 items-center">
          {user.profileImage ? (
            <Image
              source={{ uri: `data:image/png;base64,${user.profileImage}` }}
              className="h-36 w-36 rounded-full bg-gray-200"
            />
          ) : (
            <View className="h-36 w-36 items-center justify-center rounded-full bg-purple-500">
              <Text className="text-5xl font-bold text-white">
                {user.username.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
          <TouchableOpacity className="border-3 absolute bottom-1 right-1 h-9 w-9 items-center justify-center rounded-full border-white bg-purple-500">
            <Octicons name="pencil" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <Text className="mt-4 text-center text-2xl font-bold text-gray-800">{user.username}</Text>
        <Text className="mt-1 text-center text-base text-gray-500">{user.email}</Text>

        {/* Role Badges */}
        <View className="mt-3 flex-row flex-wrap justify-center">
          {user.roles.map((role, index) => (
            <View key={index} className="mx-1 mb-2 rounded-full bg-purple-100 px-3 py-1.5">
              <Text className="text-sm font-semibold text-purple-700">{role.substring(5)}</Text>
            </View>
          ))}
        </View>

        {/* Account Settings Section */}
        <View className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-800">Account Settings</Text>

          <TouchableOpacity className="flex-row items-center border-b border-gray-100 py-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Octicons name="person" size={20} color="#8b5cf6" />
            </View>
            <Text className="flex-1 text-base text-gray-600">Edit Profile</Text>
            <Octicons name="chevron-right" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center border-b border-gray-100 py-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Octicons name="shield-lock" size={20} color="#8b5cf6" />
            </View>
            <Text className="flex-1 text-base text-gray-600">Security</Text>
            <Octicons name="chevron-right" size={20} color="#6b7280" />
          </TouchableOpacity>

          {/* <TouchableOpacity className="flex-row items-center border-b border-gray-100 py-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Octicons name="bell" size={20} color="#8b5cf6" />
            </View>
            <Text className="flex-1 text-base text-gray-600">Notifications</Text>
            <Octicons name="chevron-right" size={20} color="#6b7280" />
          </TouchableOpacity>

          {user.twoFactorRequired && (
            <TouchableOpacity className="flex-row items-center border-b border-gray-100 py-4">
              <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Octicons name="shield-check" size={20} color="#8b5cf6" />
              </View>
              <Text className="flex-1 text-base text-gray-600">Two-Factor Authentication</Text>
              <View className="rounded-md bg-green-100 px-2.5 py-1">
                <Text className="text-xs font-semibold text-green-700">Enabled</Text>
              </View>
            </TouchableOpacity>
          )} */}
        </View>

        {/* Preferences Section */}
        {/* <View className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-800">Preferences</Text>

          <TouchableOpacity className="flex-row items-center border-b border-gray-100 py-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Octicons name="paintbrush" size={20} color="#8b5cf6" />
            </View>
            <Text className="flex-1 text-base text-gray-600">Appearance</Text>
            <Octicons name="chevron-right" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-4">
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Octicons name="globe" size={20} color="#8b5cf6" />
            </View>
            <Text className="flex-1 text-base text-gray-600">Language</Text>
            <Octicons name="chevron-right" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View> */}

        {/* Logout Button */}
        <TouchableOpacity className="mb-4 mt-8 flex-row items-center justify-center rounded-xl bg-red-100 p-4" onPress={handleLogout}>
          <Octicons name="sign-out" size={20} color="#ef4444" />
          <Text className="ml-2 text-base font-semibold text-red-500">Logout</Text>
        </TouchableOpacity>

        <View className="mb-8 items-center">
          <Text className="text-sm text-gray-400">App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
