import type { LucideProps } from 'lucide-react-native';
import React from 'react';

interface TabBarIconProps {
  IconComponent: React.ElementType<LucideProps>;
  color: string;
  size: number;
}

export function MenuIcon({ IconComponent, color, size }: TabBarIconProps) {
  return <IconComponent color={color} size={size} />;
}