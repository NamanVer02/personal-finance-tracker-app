// ThemeToggle.js
import { useColorScheme } from 'nativewind';
import { View, Text, Pressable } from 'react-native';
import { Octicons } from '@expo/vector-icons';

type ThemeToggleProps = {
  compact?: boolean;
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact }) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  if (compact) {
    return (
      <Pressable className="items-center" onPress={toggleColorScheme}>
        <View className="h-12 w-12 items-center justify-center rounded-full bg-purple-100">
          <Octicons name={colorScheme === 'dark' ? 'sun' : 'moon'} size={20} color="#8b5cf6" />
        </View>
        <Text className="mt-1 text-xs text-gray-700">
          {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
        </Text>
      </Pressable>
    );
  }

  // Default (full) mode
  return (
    <View className="items-center">
      <Pressable onPress={toggleColorScheme} className="rounded-custom bg-accent p-3">
        <Text className="font-medium text-white">
          Switch to {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
        </Text>
      </Pressable>
    </View>
  );
}

export default ThemeToggle;