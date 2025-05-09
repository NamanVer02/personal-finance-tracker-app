import { View, Dimensions, Pressable, Text } from 'react-native';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Octicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from 'contexts/ThemeContext';
import { useThemeStyles } from 'contexts/ThemeUtils';

// Define routes with icons for 4 screens
export const routes = {
  profile: { name: 'Profile', icon: 'person' },
  dashboard: { name: 'Dashboard', icon: 'home' },
  analytics: { name: 'Analytics', icon: 'graph' },
  transactions: { name: 'Transactions', icon: 'list-unordered' },
};

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width * 0.75;
const ICONS_CONTAINER_WIDTH = width * 0.6;
const NUM_TABS = 4;
const TAB_WIDTH = ICONS_CONTAINER_WIDTH / NUM_TABS;
const ICON_SIZE = 24;
const HIGHLIGHT_SIZE = 40;

const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation, descriptors }) => {
  const { isDarkMode } = useTheme();
  const styles = useThemeStyles();
  const translateX = useSharedValue(0);
  const focusedTab = state.index;

  useEffect(() => {
    // Calculate the center position of the tab
    const newPosition = focusedTab * TAB_WIDTH + TAB_WIDTH / 2 - HIGHLIGHT_SIZE / 2;
    translateX.value = withTiming(newPosition, { duration: 300 });
  }, [focusedTab, translateX]);

  const highlightStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: HIGHLIGHT_SIZE,
      height: HIGHLIGHT_SIZE,
      borderRadius: HIGHLIGHT_SIZE / 2,
      position: 'absolute',
      backgroundColor: isDarkMode ? '#374151' : '#ede9fe',
    };
  });

  return (
    <View
      className={`absolute bottom-6 flex-row items-center justify-center rounded-[32px] shadow-md shadow-black/10 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{
        width: TAB_BAR_WIDTH,
        left: (width - TAB_BAR_WIDTH) / 2,
        paddingVertical: 10,
      }}>
      <View
        style={{
          width: ICONS_CONTAINER_WIDTH,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}>
        <Animated.View style={highlightStyle} />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({
                name: route.name,
                merge: true,
                params: {},
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Use route.name in lowercase to index routes object
          const routeName = route.name.toLowerCase().replace(/\s+/g, '') as keyof typeof routes;
          const icon = routes[routeName]?.icon || 'question';

          return (
            <Pressable
              key={`route-${index}`}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ width: TAB_WIDTH, height: HIGHLIGHT_SIZE }}
              className="items-center justify-center">
              <Text>
                <Octicons
                  name={icon as any}
                  size={ICON_SIZE}
                  color={isFocused ? styles.iconColor : isDarkMode ? '#6b7280' : '#A9A9A9'}
                />
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
