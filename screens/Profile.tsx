import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator } from 'react-native';
import { logout } from 'services/authService';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import UpdatePasswordModal from 'components/modals/UpdatePasswordModal';
import { useUser } from 'contexts/UserContext';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';
import { uploadProfilePhoto } from 'services/userService';
import ThemeToggle from 'components/ui/theme-toggle';

export default function Profile() {
  const navigation = useNavigation();
  const { user, setUser } = useUser();
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();
  const [loading, setLoading] = useState(true);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  const handleLogout = async () => {
    const response = await logout();
    if (response.ok) {
      setUser(null);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      console.error('Logout failed:', response.error);
    }
  };

  const handleImageUpload = async () => {
    // 1. Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: false, // Not needed for FormData upload
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset?.uri) return;

    // 2. Prepare FormData
    const uriParts = asset.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    const fileName = asset.fileName || `profile.${fileType}`;

    const formData = new FormData();
    formData.append('file', {
      uri: asset.uri,
      name: fileName,
      type: asset.type || `image/${fileType}`,
    } as any); // 'as any' is needed for React Native FormData

    // 3. Upload to API
    const response = await uploadProfilePhoto(user?.id ?? ' ', formData, setUser);
    if (!response.ok) {
      console.error('Some error in uploading the image', response.message);
    } else {
      Alert.alert('Image Upload Successful', 'The new avatar will be visible after a re-login');
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
      <View className={`flex-1 items-center justify-center ${styles.bgPrimary}`}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className={`flex-1 items-center justify-center ${styles.bgPrimary}`}>
        <Text className="text-base text-red-500">User not found. Please login again.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${styles.bgPrimary}`}>
      <UpdatePasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
      />

      <StatusBar barStyle={styles.statusBarStyle} backgroundColor={styles.statusBarBgColor} />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <Text>
              <Octicons name="arrow-left" size={24} color={isDarkMode ? '#d1d5db' : '#6b7280'} />
            </Text>
          </TouchableOpacity>
          <Text className={`text-xl font-bold ${styles.textPrimary}`}>Profile</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Profile Image and Name */}
        <View className="relative mt-5 items-center">
          <TouchableOpacity onPress={handleImageUpload} activeOpacity={0.7}>
            {user.profileImage ? (
              <Image
                source={{ uri: `data:image/png;base64,${user.profileImage}` }}
                className={`h-36 w-36 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                key={user.profileImage}
              />
            ) : (
              <View className="h-36 w-36 items-center justify-center rounded-full bg-purple-500">
                <Text className="text-5xl font-bold text-white">
                  {user.username.substring(0, 2).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text className={`mt-4 text-center text-2xl font-bold ${styles.textPrimary}`}>
          {user.username}
        </Text>
        <Text className={`mt-1 text-center text-base ${styles.textSecondary}`}>{user.email}</Text>

        {/* Role Badges */}
        <View className="mt-3 flex-row flex-wrap justify-center">
          {user.roles.map((role, index) => (
            <View
              key={index}
              className={`mx-1 mb-2 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} px-3 py-1.5`}>
              <Text
                className={`text-sm font-semibold ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                {role.substring(5)}
              </Text>
            </View>
          ))}
        </View>

        {/* Account Settings Section */}
        <View className={`mx-6 mt-8 rounded-2xl ${styles.bgSecondary} p-4`}>
          <Text className={`mb-4 text-lg font-semibold ${styles.textPrimary}`}>
            Account Settings
          </Text>

          <TouchableOpacity className={`flex-row items-center border-b ${styles.borderColor} py-4`}>
            <View
              className={`mr-4 h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
              <Text>
                <Octicons name="person" size={20} color={styles.iconColor} />
              </Text>
            </View>
            <Text className={`flex-1 text-base ${styles.textSecondary}`}>Edit Profile</Text>
            <Text>
              <Octicons name="chevron-right" size={20} color={isDarkMode ? '#d1d5db' : '#6b7280'} />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-4"
            onPress={() => setIsPasswordModalVisible(true)}>
            <View
              className={`mr-4 h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
              <Text>
                <Octicons name="shield-lock" size={20} color={styles.iconColor} />
              </Text>
            </View>
            <Text className={`flex-1 text-base ${styles.textSecondary}`}>Update Password</Text>
            <Text>
              <Octicons name="chevron-right" size={20} color={isDarkMode ? '#d1d5db' : '#6b7280'} />
            </Text>
          </TouchableOpacity>

          {/* Uncomment if needed
          <TouchableOpacity className={`flex-row items-center border-b ${styles.borderColor} py-4`}>
            <View className={`mr-4 h-10 w-10 items-center justify-center rounded-full ${styles.iconBg}`}>
              <Text>
                <Octicons name="bell" size={20} color={styles.iconColor} />
              </Text>
            </View>
            <Text className={`flex-1 text-base ${styles.textSecondary}`}>Notifications</Text>
            <Text>
              <Octicons name="chevron-right" size={20} color={isDarkMode ? "#d1d5db" : "#6b7280"} />
            </Text>
          </TouchableOpacity>
          */}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className={`mx-6 mb-4 mt-8 flex-row items-center justify-center rounded-xl ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'} p-4`}
          onPress={handleLogout}>
          <Text>
            <Octicons name="sign-out" size={20} color="#ef4444" />
          </Text>
          <Text className="ml-2 text-base font-semibold text-red-500">Logout</Text>
        </TouchableOpacity>

        <View className="mb-8 items-center">
          <Text className={`text-sm ${styles.textMuted}`}>App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
