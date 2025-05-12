import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: string; // Class name for height (e.g., 'h-4/5', 'h-3/4')
  showScrollView?: boolean;
  actionButton?: {
    label: string;
    onPress: () => void;
  };
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
  height = 'h-4/5',
  showScrollView = true,
  actionButton,
}) => {
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();

  const renderContent = () => {
    if (showScrollView) {
      return (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      );
    }
    return <View className="flex-1">{children}</View>;
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View className="flex-1 justify-end bg-black/50">
          <View
            className={`${height} rounded-t-3xl ${isDarkMode ? 'bg-gray-900/20' : 'bg-white'} p-6`}>
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className={`text-2xl font-bold ${styles.textPrimary}`}>{title}</Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Text>
                  <Octicons name="x" size={24} color={isDarkMode ? '#d1d5db' : '#6b7280'} />
                </Text>
              </TouchableOpacity>
            </View>

            {renderContent()}

            {/* Action Button (if provided) */}
            {actionButton && (
              <TouchableOpacity
                onPress={actionButton.onPress}
                className="mt-4 rounded-xl bg-purple-500 py-4">
                <Text className="text-center text-lg font-semibold text-white">
                  {actionButton.label}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BaseModal;
