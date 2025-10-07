import React, { createContext, ReactNode, useContext, useRef } from 'react';
import { DimensionValue, StyleProp, ViewProps, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

interface AnimationProps {
  animation: string;
  duration: number;
  delay: number;
}

type AnimationType = 'fadeInUp' | 'slideInLeft' | 'zoomIn' | 'fadeInRight' | 'fadeInDown' | 'fadeOutUp' | 'fadeOutDown';

interface AnimationContextType {
  getAnimationProps: (type?: AnimationType) => AnimationProps;
}

const AnimationContext = createContext<AnimationContextType>({
  getAnimationProps: () => ({
    animation: 'fadeInUp',
    duration: 700,
    delay: 0,
  }),
});

interface AnimationProviderProps {
  children: ReactNode;
  defaultAnimation?: AnimationType;
}

export function AnimationProvider({ children, defaultAnimation = 'fadeInUp' }: AnimationProviderProps) {
  const animationIndex = useRef(0);

  const getAnimationProps = (type?: AnimationType): AnimationProps => {
    const animation = type || defaultAnimation;
    const delay = animationIndex.current * 100;
    animationIndex.current += 1;

    switch (animation) {
      case 'slideInLeft':
        return { animation: 'slideInLeft', duration: 800, delay };
      case 'zoomIn':
        return { animation: 'zoomIn', duration: 600, delay };
      case 'fadeInRight':
        return { animation: 'fadeInRight', duration: 800, delay };
      case 'fadeInDown':
        return { animation: 'fadeInDown', duration: 700, delay };
      case 'fadeOutUp':
        return { animation: 'fadeOutUp', duration: 500, delay };
      case 'fadeOutDown':
        return { animation: 'fadeOutDown', duration: 500, delay };

      case 'fadeInUp':
      default:
        return { animation: 'fadeInUp', duration: 700, delay };
    }
  };

  animationIndex.current = 0;

  return (
    <AnimationContext.Provider value={{ getAnimationProps }}>
      {children}
    </AnimationContext.Provider>
  );
}

function useAnimation() {
  return useContext(AnimationContext);
}

interface AnimatedViewProps extends ViewProps {
  animationType?: AnimationType;
  width?: DimensionValue;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  style?: StyleProp<ViewStyle>;
}

export function AnimatedView({
  width = '100%',
  alignItems = 'center',
  children,
  style,
  animationType,
  ...rest
}: AnimatedViewProps) {
  const { getAnimationProps } = useAnimation();
  const animationProps = getAnimationProps(animationType);

  const baseStyle = {
    width,
    alignItems,
  };

  return (
    <Animatable.View
      {...animationProps}
      style={[baseStyle, style]}
      {...rest}
    >
      {children}
    </Animatable.View>
  );
}