// screens/Register.tsx
import { useState } from "react";
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
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { RegisterRequestDTO } from "interfaces/dto";
import { register } from "services/authService";


export default function Register() {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Placeholder function - you'll implement actual registration later
    const handleRegister = async () => {
        const registerRequest: RegisterRequestDTO = {
            username: username,
            email: email,
            password: password,
            roles: ["user"],
            profileImage: avatar || "",
        }

        const result = await register(registerRequest);
        if (result.ok) {
            navigation.navigate("Login");
        }
    };

    // Handle avatar upload
    const handleAvatarUpload = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to grant access to your photo library to upload an avatar.");
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
        setAvatar("generated");
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
                                Join FinTrack to start managing your personal finances effectively.
                            </Text>
                        </View>


                        {/* Form */}
                        <View className="mb-8">
                            {/* Avatar Upload */}
                            <View className="mb-6">
                                <Text className="text-text font-semibold text-sm mb-2">
                                    Profile Picture
                                </Text>
                                <View className="flex-row items-center flex-wrap gap-3">
                                    <View className="w-20 h-20 bg-accent-light rounded-full items-center justify-center overflow-hidden">
                                        {avatar ? (
                                            avatar === "generated" ? (
                                                <View className="w-full h-full bg-accent items-center justify-center">
                                                    <Text className="text-white text-2xl font-bold">FT</Text>
                                                </View>
                                            ) : (
                                                <Image source={{ uri: avatar }} className="w-full h-full" />
                                            )
                                        ) : (
                                            <Text className="text-accent text-2xl font-bold">FT</Text>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        className="bg-white border border-[#e6dff7] rounded-custom px-4 py-2.5"
                                        onPress={handleAvatarUpload}
                                    >
                                        <Text className="text-text text-sm">Upload Avatar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="bg-white border border-[#e6dff7] rounded-custom px-4 py-2.5"
                                        onPress={createAvatar}
                                    >
                                        <Text className="text-text text-sm">Create Avatar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Username Input */}
                            <View className="mb-6">
                                <Text className="text-text font-semibold text-sm mb-2">
                                    Username
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="w-full px-4 py-4 bg-white border border-[#e6dff7] rounded-custom text-text"
                                        placeholder="Choose a username"
                                        placeholderTextColor="#8a7ca8"
                                        value={username}
                                        onChangeText={setUsername}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {/* Email Input */}
                            <View className="mb-6">
                                <Text className="text-text font-semibold text-sm mb-2">
                                    Email Address
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="w-full px-4 py-4 bg-white border border-[#e6dff7] rounded-custom text-text"
                                        placeholder="Enter your email"
                                        placeholderTextColor="#8a7ca8"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            {/* Password Input */}
                            <View className="mb-6">
                                <Text className="text-text font-semibold text-sm mb-2">
                                    Password
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="w-full px-4 py-4 bg-white border border-[#e6dff7] rounded-custom text-text"
                                        placeholder="Create a password"
                                        placeholderTextColor="#8a7ca8"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Octicons
                                            name={showPassword ? "eye-closed" : "eye"}
                                            size={20}
                                            color="#8a7ca8"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirm Password Input */}
                            <View className="mb-6">
                                <Text className="text-text font-semibold text-sm mb-2">
                                    Confirm Password
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="w-full px-4 py-4 bg-white border border-[#e6dff7] rounded-custom text-text"
                                        placeholder="Confirm your password"
                                        placeholderTextColor="#8a7ca8"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <Octicons
                                            name={showPassword ? "eye-closed" : "eye"}
                                            size={20}
                                            color="#8a7ca8"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Register Button */}
                            <TouchableOpacity
                                className="w-full bg-accent py-4 rounded-custom mt-2"
                                onPress={handleRegister}
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-center font-semibold">
                                    Create Account
                                </Text>
                            </TouchableOpacity>

                            {/* Login Link */}
                            <View className="mt-6 items-center">
                                <Text className="text-text-light text-base">
                                    Already have an account?{" "}
                                    <Text
                                        className="text-accent font-medium"
                                        onPress={() => navigation.navigate('Login')}
                                    >
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
