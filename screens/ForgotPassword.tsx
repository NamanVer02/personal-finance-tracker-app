import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import apiClient from 'services/apiClient';
import { checkUser, forgotPassword } from 'services/userService';

export default function ForgotPassword() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();

  // State variables
  const [username, setUsername] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: username, 2: 2FA and new password
  const [error, setError] = useState('');

  // Check if username exists
  const handleCheckUsername = async () => {
    if (!username) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    setIsLoading(true);
      setError('');

    try {
      const response = await checkUser(username);
      if (response.ok) {
        setCurrentStep(2);
      } else {
        setError('Username not found. Please check and try again.');
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setError('Could not verify username. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleResetPassword = async () => {
    if (!twoFactorCode || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call API to verify 2FA and reset password
      const response = await forgotPassword(username, Number(twoFactorCode), newPassword)

      if (response.ok) {
        Alert.alert('Success', 'Your password has been reset successfully', [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        setError('Failed to reset password. Please verify your 2FA code and try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('An error occurred while resetting your password. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-10">
          <View className="mx-auto w-full max-w-[420px]">
            {/* Header with Back Button */}
            <View className="mb-8 flex-row items-center">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2 p-2">
                <Octicons name="arrow-left" size={24} color="#6b7280" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-text">Reset Password</Text>
              </View>
            </View>

            {/* Step indicator */}
            <View className="mb-8 flex-row justify-center space-x-4">
              <View className={`items-center ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-accent' : 'bg-gray-300'}`}>
                  <Text className="font-bold text-white">1</Text>
                </View>
                <Text className="mt-1 text-xs text-text-light">Username</Text>
              </View>
              <View className="h-1 w-16 self-center bg-gray-200" />
              <View className={`items-center ${currentStep >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-accent' : 'bg-gray-300'}`}>
                  <Text className="font-bold text-white">2</Text>
                </View>
                <Text className="mt-1 text-xs text-text-light">Verification</Text>
              </View>
            </View>

            {/* Error message if any */}
            {error ? (
              <View className="mb-4 rounded-xl bg-red-100 p-3">
                <Text className="text-red-600">{error}</Text>
              </View>
            ) : null}

            {/* Step 1: Username */}
            {currentStep === 1 && (
              <>
                <View className="mb-8">
                  <Text className="text-base text-text-light">
                    Enter your username to start the password reset process.
                  </Text>
                </View>

                <View className="mb-6">
                  <Text className="mb-2 text-sm font-semibold text-text">Username</Text>
                  <TextInput
                    className="w-full rounded-custom border border-[#e6dff7] bg-white px-4 py-4 text-text"
                    placeholder="Enter your username"
                    placeholderTextColor="#8a7ca8"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity
                  className={`mt-2 w-full rounded-custom py-4 ${
                    isLoading ? 'bg-accent/70' : 'bg-accent'
                  }`}
                  onPress={handleCheckUsername}
                  activeOpacity={0.8}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-center font-semibold text-white">Continue</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Step 2: 2FA Verification and New Password */}
            {currentStep === 2 && (
              <>
                <View className="mb-8">
                  <Text className="text-base text-text-light">
                    Enter the 6-digit code from your authenticator app and set your new password.
                  </Text>
                </View>

                {/* 2FA Code Input */}
                <View className="mb-6">
                  <Text className="mb-2 text-sm font-semibold text-text">2FA Code</Text>
                  <TextInput
                    className="w-full rounded-custom border border-[#e6dff7] bg-white px-4 py-4 text-text"
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#8a7ca8"
                    value={twoFactorCode}
                    onChangeText={setTwoFactorCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading}
                  />
                </View>

                {/* New Password Input */}
                <View className="mb-6">
                  <Text className="mb-2 text-sm font-semibold text-text">New Password</Text>
                  <View className="relative">
                    <TextInput
                      className="w-full rounded-custom border border-[#e6dff7] bg-white px-4 py-4 text-text"
                      placeholder="Enter new password"
                      placeholderTextColor="#8a7ca8"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-4"
                      onPress={() => setShowNewPassword(!showNewPassword)}>
                      <Octicons
                        name={showNewPassword ? 'eye-closed' : 'eye'}
                        size={20}
                        color="#8a7ca8"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password Input */}
                <View className="mb-6">
                  <Text className="mb-2 text-sm font-semibold text-text">Confirm New Password</Text>
                  <View className="relative">
                    <TextInput
                      className="w-full rounded-custom border border-[#e6dff7] bg-white px-4 py-4 text-text"
                      placeholder="Confirm new password"
                      placeholderTextColor="#8a7ca8"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-4"
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Octicons
                        name={showConfirmPassword ? 'eye-closed' : 'eye'}
                        size={20}
                        color="#8a7ca8"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  className={`mt-2 w-full rounded-custom py-4 ${
                    isLoading ? 'bg-accent/70' : 'bg-accent'
                  }`}
                  onPress={handleResetPassword}
                  activeOpacity={0.8}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-center font-semibold text-white">Reset Password</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Back to Login */}
            <TouchableOpacity className="mt-6" onPress={() => navigation.navigate('Login')}>
              <Text className="text-center font-medium text-accent">Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
