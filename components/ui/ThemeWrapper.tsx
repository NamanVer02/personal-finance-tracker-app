import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const { setColorScheme } = useColorScheme();

  // Sync the nativewind colorScheme with our theme context
  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setColorScheme]);

  return (
    <View
      className={`flex-1 ${isDarkMode ? 'dark bg-gray-900' : 'light bg-gray-50'}`}
      style={{ backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb' }}>
      {children}
    </View>
  );
};

export default ThemeWrapper;
