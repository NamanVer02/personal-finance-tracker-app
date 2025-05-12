import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { login } from 'services/authService';
import { LoginRequestDTO } from 'interfaces/dto';
import { useUser } from 'contexts/UserContext';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';

export default function Login() {
  const navigation = useNavigation();
  const { setUser } = useUser();
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Placeholder function - you'll implement actual login later
  const handleLogin = async () => {
    const loginRequest: LoginRequestDTO = {
      username: username,
      password: password,
      twoFactorCode: twoFactorCode,
    };

    const result = await login(loginRequest);

    if (result.ok) {
      await setUser(result.user ?? null);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${styles.bgPrimary}`}
      style={{ backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb' }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-10">
          <View className="mx-auto w-full max-w-[420px]">
            {/* Header */}
            <View className="mb-10">
              <View className="mb-6 flex-row items-center">
                <View className="flex h-12 w-12 items-center justify-center rounded-custom bg-accent">
                  <Text className="text-2xl font-bold text-white">F</Text>
                </View>
                <Text className={`text-2xl font-bold ${styles.textPrimary} ml-4`}>
                  Sign in to FinTrack
                </Text>
              </View>
              <Text className={`text-base ${styles.textSecondary}`}>
                Track your finances, set budgets, and reach your financial goals.
              </Text>
            </View>

            {/* Form */}
            <View className="mb-8">
              {/* Email Input */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-semibold ${styles.textPrimary}`}>Username</Text>
                <TextInput
                  className={`w-full rounded-custom border border-[#e6dff7] px-4 py-4 ${styles.bgInput}`}
                  placeholder="Enter your username"
                  placeholderTextColor={isDarkMode ? '#9ca3af' : '#8a7ca8'}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  style={{ color: isDarkMode ? '#ffffff' : '#1f2937' }}
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-semibold ${styles.textPrimary}`}>Password</Text>
                <View className="relative">
                  <TextInput
                    className={`w-full rounded-custom border border-[#e6dff7] px-4 py-4 ${styles.bgInput}`}
                    placeholder="Enter your password"
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#8a7ca8'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={{ color: isDarkMode ? '#ffffff' : '#1f2937' }}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword(!showPassword)}>
                    <Text>
                      <Octicons
                        name={showPassword ? 'eye-closed' : 'eye'}
                        size={20}
                        color={isDarkMode ? '#9ca3af' : '#8a7ca8'}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 2FA Input */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-semibold ${styles.textPrimary}`}>2FA Code</Text>
                <TextInput
                  className={`w-full rounded-custom border border-[#e6dff7] px-4 py-4 ${styles.bgInput}`}
                  placeholder="Enter your 6-digit code"
                  placeholderTextColor={isDarkMode ? '#9ca3af' : '#8a7ca8'}
                  value={twoFactorCode}
                  onChangeText={setTwoFactorCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={{ color: isDarkMode ? '#ffffff' : '#1f2937' }}
                />
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                className="mt-2 w-full rounded-custom bg-accent py-4"
                onPress={handleLogin}
                activeOpacity={0.8}>
                <Text className="text-center font-semibold text-white">Sign In</Text>
              </TouchableOpacity>

              {/* Secondary Actions */}
              <View className="mt-6 flex-row justify-between">
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text className="text-base font-medium text-accent">Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Register');
                  }}>
                  <Text className="text-base font-medium text-accent">Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
