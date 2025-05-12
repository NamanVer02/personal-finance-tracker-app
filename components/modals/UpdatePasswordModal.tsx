import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { PasswordResetModalProps } from 'interfaces/props';
import { useUser } from 'contexts/UserContext';
import { updatePassword } from 'services/userService';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ visible, onClose }) => {
  const { user } = useUser();
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadiing, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }

    try {
      // Call your update password function
      if (user && user.id) {
        const result = await updatePassword(currentPassword, newPassword, user?.id);

        if (result.ok) {
          Alert.alert('Success', result.message);
          // Reset form and close modal
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          onClose();
        } else {
          Alert.alert('Error', result.message);
        }
      } else {
        Alert.alert('Error', 'User information is not available');
      }
    } catch (error) {
      console.error('Error in password update:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }

    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <View className="flex-1 justify-end bg-black/50 backdrop-blur-sm">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          className="w-full">
          <View
            className={`rounded-t-3xl ${styles.bgSecondary} p-6`}
            style={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }}>
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className={`text-2xl font-bold ${styles.textPrimary}`}>Update Password</Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Text>
                  <Octicons name="x" size={24} color={isDarkMode ? '#d1d5db' : '#6b7280'} />
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
              {/* Current Password Field */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm ${styles.textSecondary}`}>Current Password</Text>
                <View className={`flex-row items-center rounded-xl ${styles.bgInput} px-4 py-3`}>
                  <TextInput
                    className={`flex-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                  />
                  <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <Text>
                      <Octicons
                        name={showCurrentPassword ? 'eye-closed' : 'eye'}
                        size={20}
                        color={isDarkMode ? '#d1d5db' : '#6b7280'}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password Field */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm ${styles.textSecondary}`}>New Password</Text>
                <View className={`flex-row items-center rounded-xl ${styles.bgInput} px-4 py-3`}>
                  <TextInput
                    className={`flex-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Text>
                      <Octicons
                        name={showNewPassword ? 'eye-closed' : 'eye'}
                        size={20}
                        color={isDarkMode ? '#d1d5db' : '#6b7280'}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Field */}
              <View className="mb-6">
                <Text className={`mb-2 text-sm ${styles.textSecondary}`}>Confirm New Password</Text>
                <View className={`flex-row items-center rounded-xl ${styles.bgInput} px-4 py-3`}>
                  <TextInput
                    className={`flex-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor={isDarkMode ? '#9ca3af' : '#9ca3af'}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Text>
                      <Octicons
                        name={showConfirmPassword ? 'eye-closed' : 'eye'}
                        size={20}
                        color={isDarkMode ? '#d1d5db' : '#6b7280'}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="mt-4 flex-row justify-end gap-4 space-x-3">
              <TouchableOpacity
                onPress={onClose}
                className={`rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-3`}>
                <Text
                  className={
                    isDarkMode ? 'font-medium text-gray-300' : 'font-medium text-gray-700'
                  }>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdatePassword}
                className="flex-row items-center rounded-xl bg-purple-500 px-4 py-3">
                <Text>
                  <Octicons name="check" size={18} color="#ffffff" />
                </Text>
                <Text className="ml-2 font-semibold text-white">Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PasswordResetModal;
