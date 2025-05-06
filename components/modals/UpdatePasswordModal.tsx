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
  Alert
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { PasswordResetModalProps } from 'interfaces/props';
import { useUser } from 'contexts/UserContext';
import { updatePassword } from 'services/userService';

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ visible, onClose }) => {
  const { user } = useUser();

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
            Alert.alert("Error", "User information is not available")
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
            <View className="rounded-t-3xl bg-white p-6">
                      
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-800">Update Password</Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Octicons name="x" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
              {/* Current Password Field */}
              <View className="mb-6">
                <Text className="mb-2 text-sm text-gray-500">Current Password</Text>
                <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
                  <TextInput
                    className="flex-1"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <Octicons
                      name={showCurrentPassword ? 'eye-closed' : 'eye'}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password Field */}
              <View className="mb-6">
                <Text className="mb-2 text-sm text-gray-500">New Password</Text>
                <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
                  <TextInput
                    className="flex-1"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Octicons
                      name={showNewPassword ? 'eye-closed' : 'eye'}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Field */}
              <View className="mb-6">
                <Text className="mb-2 text-sm text-gray-500">Confirm New Password</Text>
                <View className="flex-row items-center rounded-xl bg-gray-100 px-4 py-3">
                  <TextInput
                    className="flex-1"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Octicons
                      name={showConfirmPassword ? 'eye-closed' : 'eye'}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="mt-4 flex-row justify-end space-x-3 gap-4">
              <TouchableOpacity onPress={onClose} className="rounded-xl bg-gray-100 px-4 py-3">
                <Text className="font-medium text-gray-700">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUpdatePassword}
                className="flex-row items-center rounded-xl bg-purple-500 px-4 py-3">
                <Octicons name="check" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                <Text className="font-semibold text-white">Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PasswordResetModal;
