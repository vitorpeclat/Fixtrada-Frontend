// src/components/IconSelect.tsx

import { Colors } from '@/theme/colors';
import { FilterStatus } from '@/types/FilterStatus';
import type { LucideProps } from 'lucide-react-native';
import React, { useEffect, useMemo } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface IconSelectProps {
    IconComponent: React.ElementType<LucideProps>;
    status: FilterStatus;
    size: number;
}

export function IconSelect({ IconComponent, status, size }: IconSelectProps) {
    const AnimatedIcon = useMemo(
        () => Animated.createAnimatedComponent(IconComponent),
        [IconComponent]
    );

    const SELECTED_SCALE = 1.2;
    const ANIMATION_DURATION = 250;
    const progress = useSharedValue(0);

    useEffect(() => {
        const isSelected = status === FilterStatus.SELECTED;
        progress.value = withTiming(isSelected ? 1 : 0, {
            duration: ANIMATION_DURATION,
        });
    }, [status]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        const scale = 1 + (SELECTED_SCALE - 1) * progress.value;
        return {
            transform: [{ scale }],
        };
    });

    const animatedIconProps = useAnimatedProps(() => {
        const animatedColor = interpolateColor(
            progress.value,
            [0, 1], // Mapeia o progresso (0 = unselected, 1 = selected)
            [Colors.primary, Colors.secondary] // Para as cores correspondentes
        );
        
        // CORREÇÃO APLICADA: 'stroke' é a propriedade correta para animar em SVGs
        return {
            stroke: animatedColor,
        };
    });

    return (
        <Animated.View style={animatedContainerStyle}>
            <AnimatedIcon 
                animatedProps={animatedIconProps} 
                size={size}
            />
        </Animated.View>
    );
}