import { useColorScheme } from 'nativewind';
import { View, Text, Pressable } from 'react-native';

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  return (
    <View className="items-center">
      <Pressable 
        onPress={toggleColorScheme}
        className="bg-accent p-3 rounded-custom"
      >
        <Text className="text-white font-medium">
          Switch to {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
        </Text>
      </Pressable>
    </View>
  );
}

export default ThemeToggle;