// ThemeToggle.js
import { useColorScheme } from 'nativewind';
import { View, Text, Pressable } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemeStyles } from '../../contexts/ThemeUtils';

type ThemeToggleProps = {
  compact?: boolean;
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact }) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { isDarkMode, toggleTheme } = useTheme();
  const styles = useThemeStyles();

  const handleToggle = () => {
    toggleTheme(); // Update our theme context
    toggleColorScheme(); // Also toggle nativewind for styling
  };

  if (compact) {
    return (
      <Pressable className="items-center" onPress={handleToggle}>
        <View className={`h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
          <Text>
            <Octicons name={isDarkMode ? 'sun' : 'moon'} size={20} color={styles.iconColor} />
          </Text>
        </View>
        <Text className={`mt-1 text-xs ${styles.textPrimary}`}>
          {isDarkMode ? 'Light' : 'Dark'}
        </Text>
      </Pressable>
    );
  }

  // Default (full) mode
  return (
    <View className="items-center">
      <Pressable onPress={handleToggle} className="rounded-custom bg-accent p-3">
        <Text className="font-medium text-white">
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </Text>
      </Pressable>
    </View>
  );
};

export default ThemeToggle;
