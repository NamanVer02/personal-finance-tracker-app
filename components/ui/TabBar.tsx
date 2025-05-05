import { View, Dimensions, Pressable } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Octicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Define routes with icons for 4 screens
export const routes = {
  profile: { name: 'Profile', icon: 'person' },
  dashboard: { name: 'Dashboard', icon: 'home' },
  analytics: { name: 'Analytics', icon: 'graph' },
  transactions: { name: 'Transactions', icon: 'list-unordered' },
};

const { width } = Dimensions.get('window');
const FIXED_WIDTH = width * 0.7;
const ICON_SIZE = 40;
const ICON_GAP = 24;
const ICONS_TOTAL_WIDTH = ICON_SIZE * 4 + ICON_GAP * 3;
const SIDE_PADDING = (FIXED_WIDTH - ICONS_TOTAL_WIDTH) / 2;
const HIGHLIGHT_SIZE = ICON_SIZE;

const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation, descriptors }) => {
  const translateX = useSharedValue(0);
  const focusedTab = state.index;

  const handleAnimate = (index: number) => {
    'worklet';
    // Calculate position based on icon size and gaps
    const newTranslateX = SIDE_PADDING + index * (ICON_SIZE + ICON_GAP);

    translateX.value = withTiming(newTranslateX, {
      duration: 300,
    });
  };

  useEffect(() => {
    runOnUI(handleAnimate)(focusedTab);
  }, [focusedTab]);

  const rnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: HIGHLIGHT_SIZE,
      height: HIGHLIGHT_SIZE,
      borderRadius: HIGHLIGHT_SIZE / 2,
      shadowOpacity: 0,
    };
  });

  return (
    <View
      className="absolute bottom-6 z-50 h-[60px] flex-row items-center rounded-[32px] bg-white shadow-sm shadow-black/10"
      style={{
        width: FIXED_WIDTH,
        left: (width - FIXED_WIDTH) / 2,
        paddingLeft: SIDE_PADDING,
        paddingRight: SIDE_PADDING,
      }}>
      <Animated.View className="absolute z-0 bg-purple-100" style={rnStyle} />
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

        // Apply right margin to all items except the last one
        const marginRight = index < state.routes.length - 1 ? ICON_GAP : 0;

        return (
          <Pressable
            key={`route-${index}`}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              marginRight: marginRight,
            }}
            className="items-center justify-center">
            <Octicons name={icon as any} size={24} color={isFocused ? '#8b5cf6' : '#A9A9A9'} />
          </Pressable>
        );
      })}
    </View>
  );
};

export default TabBar;
