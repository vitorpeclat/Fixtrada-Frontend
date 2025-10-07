import { EyeIcon } from "@/components/EyeIcon";
import { FilterStatus } from "@/types/FilterStatus";
import { StyleProp, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";

import { Colors } from "@/theme/colors";
import { styles } from "./styles";

interface InputProps extends TextInputProps {
    label?: string
    containerStyle?: StyleProp<ViewStyle>
    status?: FilterStatus
    onEyeIconPress?: () => void
}

export function Input({ label, containerStyle, status, onEyeIconPress, ...rest }: InputProps) {
    return (
        <View style={[label && styles.wrapperWithLabel, containerStyle]}>

            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.container}>
                <TextInput
                    style={styles.inputField} 
                    placeholderTextColor={Colors.primaryLight}
                    {...rest}
                />
                {status && (
                    <TouchableOpacity onPress={onEyeIconPress}>
                        <EyeIcon status={status} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}