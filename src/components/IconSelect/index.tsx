import { Colors } from '@/theme/colors';
import { FilterStatus } from '@/types/FilterStatus';
import type { LucideProps } from 'lucide-react-native';
import React, { useEffect, useMemo } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedProps,
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

  // Fatores de animação
  const SELECTED_SCALE = 1.2; // Aumenta o tamanho em 20%
  const ANIMATION_DURATION = 250; // Duração em milissegundos

  // SharedValue é um valor reativo para animações (0 = unselected, 1 = selected)
  const progress = useSharedValue(0);

  // useEffect observa mudanças na prop 'status' e dispara a animação
  useEffect(() => {
    const isSelected = status === FilterStatus.SELECTED;
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  }, [status, progress]);

  const animatedProps = useAnimatedProps(() => {
    const animatedColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.primary, Colors.secondary]
    );

    const animatedSize = size + (size * (SELECTED_SCALE - 1) * progress.value);

    return {
      color: animatedColor,
      size: animatedSize,
    };
  });

  return <AnimatedIcon animatedProps={animatedProps} />;
}