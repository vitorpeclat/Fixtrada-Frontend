import { router, useFocusEffect } from 'expo-router';
import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { DimensionValue, StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

// Tipos
type AnimationType = 'fadeInUp' | 'slideInLeft' | 'zoomIn' | 'fadeInRight' | 'fadeInDown' | 'fadeOutUp' | 'fadeOutDown';
type ExitAnimation = 'fadeOutUp' | 'fadeOutDown';

interface AnimationProps {
    animation: string;
    duration: number;
    delay: number;
}
interface AnimationContextType {
    getAnimationProps: (type?: AnimationType) => AnimationProps;
}
const AnimationContext = createContext<AnimationContextType>({
    getAnimationProps: () => ({ animation: 'fadeInUp', duration: 700, delay: 0 }),
});

interface ScreenAnimationContextType {
    handleGoBack: (exitAnimation: ExitAnimation) => void;
    handleNavigatePush: (path: string, exitAnimation: ExitAnimation) => void;
    handleNavigateReplace: (path: string, exitAnimation: ExitAnimation) => void;
    handleHardwareBackPress: () => boolean;
}
const ScreenAnimationContext = createContext<ScreenAnimationContextType | undefined>(undefined);

export function useScreenAnimation() {
    const context = useContext(ScreenAnimationContext);
    if (context === undefined) {
        throw new Error('useScreenAnimation deve ser usado dentro de um AnimationProvider');
    }
    return context;
}

interface AnimationProviderProps {
    children: ReactNode;
}
export function AnimationProvider({ children }: AnimationProviderProps) {
    const [animationKey, setAnimationKey] = useState(0);
    const [animationType, setAnimationType] = useState<AnimationType>('fadeInUp');
    const isFirstRun = useRef(true);

    useFocusEffect(useCallback(() => {
        const timer = setTimeout(() => {
            if (isFirstRun.current) {
                isFirstRun.current = false;
                setAnimationType('fadeInUp');
            } else {
                setAnimationType('fadeInDown');
            }
            setAnimationKey(prevKey => prevKey + 1);
        }, 150);
        return () => clearTimeout(timer);
    }, []));

    const handleGoBack = (exitAnimation: ExitAnimation) => {
        setAnimationType(exitAnimation);
        setAnimationKey(prevKey => prevKey + 1);
        setTimeout(() => { if (router.canGoBack()) { router.back() } }, 600);
    };

    const handleNavigatePush = (path: string, exitAnimation: ExitAnimation) => {
        setAnimationType(exitAnimation);
        setAnimationKey(prevKey => prevKey + 1);
        setTimeout(() => { router.push(path as any) }, 600);
    };
    
    const handleNavigateReplace = (path: string, exitAnimation: ExitAnimation) => {
        setAnimationType(exitAnimation);
        setAnimationKey(prevKey => prevKey + 1);
        setTimeout(() => { router.replace(path as any) }, 600);
    };

    const handleHardwareBackPress = () => {
        handleGoBack('fadeOutDown');
        return true; // Impede o comportamento padrão do Android
    };

    const animationIndex = useRef(0);
    const getAnimationProps = (type?: AnimationType): AnimationProps => {
        const animation = type || animationType;
        const delay = animationIndex.current * 100;
        animationIndex.current += 1;
        switch (animation) {
            case 'slideInLeft': return { animation: 'slideInLeft', duration: 800, delay };
            case 'zoomIn': return { animation: 'zoomIn', duration: 600, delay };
            case 'fadeInRight': return { animation: 'fadeInRight', duration: 800, delay };
            case 'fadeInDown': return { animation: 'fadeInDown', duration: 700, delay };
            case 'fadeOutUp': return { animation: 'fadeOutUp', duration: 500, delay };
            case 'fadeOutDown': return { animation: 'fadeOutDown', duration: 500, delay };
            case 'fadeInUp': default: return { animation: 'fadeInUp', duration: 700, delay };
        }
    };
    animationIndex.current = 0;

    return (
        <ScreenAnimationContext.Provider value={{ handleGoBack, handleNavigatePush, handleNavigateReplace, handleHardwareBackPress }}>
            <AnimationContext.Provider value={{ getAnimationProps }}>
                <View key={animationKey} style={{ flex: 1 }}>
                    {children}
                </View>
            </AnimationContext.Provider>
        </ScreenAnimationContext.Provider>
    );
}

function useAnimation() { return useContext(AnimationContext); }

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
    const baseStyle = { width, alignItems };

    return (
        <Animatable.View {...animationProps} style={[baseStyle, style]} {...rest}>
            {children}
        </Animatable.View>
    );
}