import React, { useEffect, useRef } from 'react';
import { Animated, Keyboard, StyleProp, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function KeyboardShiftView({ children, style }: Props) {
  const verticalPosition = useRef(new Animated.Value(0)).current;

  const handleKeyboardShow = (event: any) => {
    const keyboardHeight = event.endCoordinates.height;
    Animated.timing(verticalPosition, {
      toValue: -keyboardHeight / 2,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleKeyboardHide = () => {
    Animated.timing(verticalPosition, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ translateY: verticalPosition }] }]}>
      {children}
    </Animated.View>
  );
}