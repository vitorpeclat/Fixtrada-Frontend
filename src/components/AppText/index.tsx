import { Colors } from '@/theme/colors';
import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  color?: string;
  fontWeight?: TextStyle['fontWeight'];
  fontSize?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  underline?: boolean;
  style?: StyleProp<TextStyle>;
}

export function AppText({
  children,
  color = Colors.primary,
  fontWeight = '500',
  fontSize = 13,
  textAlign = 'center',
  underline = false,
  style,
  ...rest
}: AppTextProps) {
  const componentStyle: TextStyle = {
    color: color,
    fontWeight: fontWeight,
    fontSize: fontSize,
    textAlign: textAlign,
    ...(underline && { textDecorationLine: 'underline' }),
  };

  return (
    <Text style={[componentStyle, style]} {...rest}>
      {children}
    </Text>
  );
}