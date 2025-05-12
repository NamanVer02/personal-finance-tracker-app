import { useTheme } from './ThemeContext';

/**
 * A hook that returns commonly used theme classes for consistent styling across the app
 */
export const useThemeStyles = () => {
  const { isDarkMode } = useTheme();

  return {
    // Background colors - using absolute colors to ensure proper dark mode
    bgPrimary: isDarkMode ? 'bg-gray-900/10' : 'bg-gray-50',
    bgSecondary: isDarkMode ? 'bg-gray-900/20' : 'bg-white',
    bgAccent: 'bg-purple-500', // Keep accent colors consistent
    bgMuted: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    bgCard: isDarkMode ? 'bg-gray-800' : 'bg-white',
    bgInput: isDarkMode ? 'bg-gray-700' : 'bg-white',

    // Text colors
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-800',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-500',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-400',
    textAccent: 'text-purple-500',

    // Border colors
    borderColor: isDarkMode ? 'border-gray-700' : 'border-gray-200',

    // Icon backgrounds
    iconBg: isDarkMode ? 'bg-gray-700' : 'bg-purple-100',
    iconColor: '#8b5cf6', // Keep accent color consistent

    // Status bar
    statusBarStyle: isDarkMode ? 'light-content' : 'dark-content',
    statusBarBgColor: isDarkMode ? '#1f2937' : '#f9fafb',
  };
};

/**
 * A utility function to generate a class string with conditional dark mode classes
 *
 * Example:
 * getThemeClasses('mt-4 p-2', {
 *   light: 'bg-white text-black',
 *   dark: 'bg-gray-800 text-white'
 * })
 */
export const getThemeClasses = (
  baseClasses: string,
  themeClasses: { light: string; dark: string },
  isDarkMode: boolean
) => {
  const themeSpecificClasses = isDarkMode ? themeClasses.dark : themeClasses.light;
  return `${baseClasses} ${themeSpecificClasses}`;
};
