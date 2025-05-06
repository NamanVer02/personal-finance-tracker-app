import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GoogleAuthSetupProps } from 'interfaces/props';



export default function GoogleAuthSetup() {
  const navigation = useNavigation();
  const route = useRoute();
  const { qrCodeBase64, secret } = route.params as GoogleAuthSetupProps;


  // Extract twoFactorSetup data from route params
  const handleContinue = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <StatusBar />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-10">
        <View className="mx-auto w-full max-w-[420px]">
          {/* Header */}
          <View className="mb-6">
            <View className="mb-6 flex-row items-center">
              <View className="flex h-12 w-12 items-center justify-center rounded-custom bg-accent">
                <Text className="text-2xl font-bold text-white">F</Text>
              </View>
              <Text className="ml-4 text-2xl font-bold text-text">Two-Factor Authentication</Text>
            </View>
          </View>

          {/* Step-by-step Instructions */}
          <View className="mb-4">
            <View className="mb-6 flex-row items-start">
              <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-accent">
                <Text className="font-bold text-white">1</Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 font-semibold text-text">Download Google Authenticator</Text>
                <Text className="text-sm text-text-light">
                  Install the Google Authenticator app from the App Store (iOS) or Play Store
                  (Android) on your mobile device.
                </Text>
              </View>
            </View>

            <View className="mb-6 flex-row items-start">
              <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-accent">
                <Text className="font-bold text-white">2</Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 font-semibold text-text">Scan the QR Code</Text>
                <Text className="text-sm text-text-light">
                  Open Google Authenticator, tap the "+" icon, and select "Scan a QR code". Then
                  scan the QR code displayed below.
                </Text>
              </View>
            </View>

            <View className="mb-6 flex-row items-start">
              <View className="mr-3 h-6 w-6 items-center justify-center rounded-full bg-accent">
                <Text className="font-bold text-white">3</Text>
              </View>
              <View className="flex-1">
                <Text className="mb-1 font-semibold text-text">Use the Code to Sign In</Text>
                <Text className="text-sm text-text-light">
                  Next time you log in, you'll need to enter the 6-digit code from the Google
                  Authenticator app along with your password.
                </Text>
              </View>
            </View>
          </View>

          {/* QR Code Display */}
          <View className="mb-8 items-center">
            {qrCodeBase64 ? (
              <View className="mb-6 items-center">
                <Image
                  source={{ uri: `data:image/png;base64,${qrCodeBase64}` }}
                  className="h-48 w-48 rounded-lg"
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View className="mb-6 h-48 w-48 items-center justify-center rounded-lg bg-accent-light">
                <Octicons name="image" size={48} color="#8a7ca8" />
                <Text className="mt-2 text-sm text-text-light">QR Code Placeholder</Text>
              </View>
            )}

            {secret && (
              <View className="w-full items-center">
                <Text className="mb-2 text-sm text-text-light">
                  If you can't scan the QR code, enter this secret key manually:
                </Text>
                <View className="w-full rounded-custom border border-[#e6dff7] bg-white px-4 py-3">
                  <Text className="text-center font-mono text-text">{secret}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            className="w-full rounded-custom bg-accent py-4"
            onPress={handleContinue}
            activeOpacity={0.8}>
            <Text className="text-center font-semibold text-white">Continue to Login</Text>
          </TouchableOpacity>

          <Text className="mt-6 text-center text-xs text-text-light">
            If you lose access to your authenticator app, contact support for assistance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
