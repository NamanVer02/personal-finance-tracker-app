import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { login } from "services/authService";
import { LoginRequestDTO } from "interfaces/dto";
import { useUser } from "contexts/UserContext";

export default function Login() {
  const navigation = useNavigation();
  const { setUser } = useUser();

  const { colorScheme } = useColorScheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
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
          routes: [{ name: "Main" }],
        })
      )
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 py-10"
        >
          <View className="max-w-[420px] mx-auto w-full">
            {/* Header */}
            <View className="mb-10">
              <View className="flex-row items-center mb-6">
                <View className="w-12 h-12 bg-accent rounded-custom flex items-center justify-center">
                  <Text className="text-white text-2xl font-bold">F</Text>
                </View>
                <Text className="text-text text-2xl font-bold ml-4">
                  Sign in to FinTrack
                </Text>
              </View>
              <Text className="text-text-light text-base">
                Track your finances, set budgets, and reach your financial goals.
              </Text>
            </View>


            {/* Form */}
            <View className="mb-8">
              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-text font-semibold text-sm mb-2">
                  Username
                </Text>
                <TextInput
                  className="w-full px-4 py-4 bg-white border border-[#e6dff7] rounded-custom text-text"
                  placeholder="Enter your username"
                  placeholderTextColor="#8a7ca8"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-text font-semibold text-sm mb-2">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-4 bg-white border border-[#e6dff7] rounded-custom text-text"
                    placeholder="Enter your password"
                    placeholderTextColor="#8a7ca8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity className="absolute right-4 top-4" onPress={() => setShowPassword(!showPassword)}>
                    <Octicons
                      name={showPassword ? "eye-closed" : "eye"}
                      size={20}
                      color="#8a7ca8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 2FA Input */}
              <View className="mb-6">
                <Text className="text-text font-semibold text-sm mb-2">
                  2FA Code
                </Text>
                <TextInput
                  className="w-full px-4 py-4 bg-white border border-[#e6dff7] rounded-custom text-text"
                  placeholder="Enter your 6-digit code"
                  placeholderTextColor="#8a7ca8"
                  value={twoFactorCode}
                  onChangeText={setTwoFactorCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                className="w-full bg-accent py-4 rounded-custom mt-2"
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-semibold">
                  Sign In
                </Text>
              </TouchableOpacity>

              {/* Secondary Actions */}
              <View className="flex-row justify-between mt-6">
                <TouchableOpacity>
                  <Text className="text-accent font-medium text-base">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Register') }}>
                  <Text className="text-accent font-medium text-base">
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
