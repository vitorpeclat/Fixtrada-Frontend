import { StyleProp, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from "react-native"

import { styles } from "./styles"

type Props = TouchableOpacityProps & {
    title?: string
    containerStyle?: StyleProp<ViewStyle>
}

export function Button({ title, containerStyle, ...rest}: Props){
    return(
        <TouchableOpacity 
            style={[styles.container, containerStyle]} 
            activeOpacity={0.8} 
            {...rest}
        >
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}