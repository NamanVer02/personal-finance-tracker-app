// screens/Register.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { RegisterRequestDTO } from 'interfaces/dto';
import { register } from 'services/authService';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';

export default function Register() {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Placeholder function - you'll implement actual registration later
  const handleRegister = async () => {
    const registerRequest: RegisterRequestDTO = {
      username: username,
      email: email,
      password: password,
      roles: ['user'],
      profileImage: avatar || '',
    };

    const result = await register(registerRequest);
    if (result.ok && result.twoFactorResponse) {
      navigation.navigate('GoogleAuthSetup', {
        secret: result.twoFactorResponse.secret,
        qrCodeBase64: result.twoFactorResponse.qrCodeBase64,
      });
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'You need to grant access to your photo library to upload an avatar.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Create a simple avatar with initials
  const createAvatar = () => {
    // In a real app, you might generate a custom avatar
    // For now, we'll just set a placeholder
    setAvatar('generated');
  };

  return (
    <SafeAreaView className={`flex-1 ${styles.bgPrimary}`}>
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
                <Text className={`ml-4 text-2xl font-bold ${styles.textPrimary}`}>
                  Sign in to FinTrack
                </Text>
              </View>
              <Text className={`text-base ${styles.textSecondary}`}>
                Join FinTrack to start managing your personal finances effectively.
              </Text>
            </View>

            {/* Form */}
            <View className="mb-8">
              {/* Avatar Upload */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-semibold ${styles.textPrimary}`}>
                  Profile Picture
                </Text>
                <View className="flex-row flex-wrap items-center gap-3">
                  <View className="h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-accent-light">
                    {avatar ? (
                      avatar === 'generated' ? (
                        <View className="h-full w-full items-center justify-center bg-accent">
                          <Text className="text-2xl font-bold text-white">FT</Text>
                        </View>
                      ) : (
                        <Image source={{ uri: avatar }} className="h-full w-full" />
                      )
                    ) : (
                      <Text className="text-2xl font-bold text-accent">FT</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    className={`rounded-custom border border-[#e6dff7] px-4 py-2.5 ${styles.bgInput}`}
                    onPress={handleAvatarUpload}>
                    <Text className={styles.textPrimary}>Upload Avatar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`rounded-custom border border-[#e6dff7] px-4 py-2.5 ${styles.bgInput}`}
                    onPress={createAvatar}>
                    <Text className={styles.textPrimary}>Create Avatar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Username Input */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-semibold ${styles.textPrimary}`}>Username</Text>
                <View className="relative">
                  <TextInput
                    className={`w-full rounded-custom border border-[#e6dff7] px-4 py-4 ${styles.bgInput}`}
                    placeholder="Choose a username"
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#8a7ca8'}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    style={{ color: isDarkMode ? '#ffffff' : '#1f2937' }}
                  />
                </View>
              </View>

              {/* Email Input */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-semibold ${styles.textPrimary}`}>
                  Email Address
                </Text>
                <View className="relative">
                  <TextInput
                    className={`w-full rounded-custom border border-[#e6dff7] px-4 py-4 ${styles.bgInput}`}
                    placeholder="Enter your email"
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#8a7ca8'}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={{ color: isDarkMode ? '#ffffff' : '#1f2937' }}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-semibold ${styles.textPrimary}`}>Password</Text>
                <View className="relative">
                  <TextInput
                    className={`w-full rounded-custom border border-[#e6dff7] px-4 py-4 ${styles.bgInput}`}
                    placeholder="Create a password"
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#8a7ca8'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={{ color: isDarkMode ? '#ffffff' : '#1f2937' }}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-1/2 -translate-y-1/2"
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

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm font-semibold ${styles.textPrimary}`}>
                  Confirm Password
                </Text>
                <View className="relative">
                  <TextInput
                    className={`w-full rounded-custom border border-[#e6dff7] px-4 py-4 ${styles.bgInput}`}
                    placeholder="Confirm your password"
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#8a7ca8'}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={{ color: isDarkMode ? '#ffffff' : '#1f2937' }}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
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

              {/* Register Button */}
              <TouchableOpacity
                className="mt-2 w-full rounded-custom bg-accent py-4"
                onPress={handleRegister}
                activeOpacity={0.8}>
                <Text className="text-center font-semibold text-white">Create Account</Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View className="mt-6 items-center">
                <Text className={`text-base ${styles.textSecondary}`}>
                  Already have an account?{' '}
                  <Text
                    className="font-medium text-accent"
                    onPress={() => navigation.navigate('Login')}>
                    Sign in
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
