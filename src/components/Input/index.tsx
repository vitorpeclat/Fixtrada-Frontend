import { StyleProp, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";

import { Colors } from "@/theme/colors";
import { styles } from "./styles";

interface InputProps extends TextInputProps {
    label?: string
     containerStyle?: StyleProp<ViewStyle>
}

export function Input({ label, containerStyle, ...rest }: InputProps) {
    return (
        <View style={[styles.wrapper, label && styles.wrapperWithLabel, containerStyle]}>

            {label && <Text style={styles.label}>{label}</Text>}

            <TextInput
                style={styles.container}
                placeholderTextColor={Colors.primaryLight}
                {...rest} />
        </View>
    )
}