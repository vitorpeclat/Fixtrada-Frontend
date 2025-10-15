import { StyleProp, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from "react-native"

import { styles } from "./styles"

type Props = TouchableOpacityProps & {
    title?: string
    containerStyle?: StyleProp<ViewStyle>
    backgroundColor?: string
    borderColor?: string
    textColor?: string
    borderWidth?: number
}

export function Button({ title, containerStyle, backgroundColor, borderColor, textColor, borderWidth, ...rest}: Props){
    const buttonStyles = [styles.container, containerStyle];
    const textStyles = [styles.title];

    if (backgroundColor) {
        buttonStyles.push({ backgroundColor });
    }

    if (borderColor) {
        buttonStyles.push({ borderColor, borderWidth: borderWidth || 1 });
    }

    if (textColor) {
        textStyles.push({ color: textColor });
    }
    
    return(
        <TouchableOpacity 
            style={buttonStyles} 
            activeOpacity={0.8} 
            {...rest}
        >
            <Text style={textStyles}>{title}</Text>
        </TouchableOpacity>
    )
}