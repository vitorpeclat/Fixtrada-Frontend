import React from "react";
import {
    StyleProp,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: "left" | "top";
};

export function Button({
  title,
  containerStyle,
  textStyle,
  icon,
  iconPosition = "left",
  ...rest
}: Props) {
  const iconMargin = iconPosition === "left" ? { marginLeft: 8 } : { marginTop: 4 };
  const flexDirection = iconPosition === "left" ? "row" : "column";

  return (
    <TouchableOpacity
      style={[styles.container, { flexDirection }, containerStyle]}
      activeOpacity={0.8}
      {...rest}
    >
      {icon}
      {title ? (
        <Text style={[styles.title, textStyle, Boolean(icon) ? iconMargin : null]}>
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}