import { EyeIcon } from "@/components/EyeIcon";
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from "react";
import { Platform, StyleProp, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";
import { styles } from "./styles";

interface PasswordCriteria { length: boolean; uppercase: boolean; specialChar: boolean; }
interface PasswordChangeDetails { text: string; criteria: PasswordCriteria; }
interface DateChangeDetails { date: string; error: string; }
interface YearChangeDetails { year: string; }

interface InputProps extends TextInputProps {
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    status?: FilterStatus;
    onEyeIconPress?: () => void;
    type?: 'text' | 'password' | 'date' | 'cpf' | 'ano' | 'placa';
    onPasswordChange?: (details: PasswordChangeDetails) => void;
    onDateChange?: (details: DateChangeDetails) => void;
    onYearChange?: (details: YearChangeDetails) => void;
    minAge?: number
}

export function Input({
    label,
    containerStyle,
    status,
    onEyeIconPress,
    type = 'text',
    value,
    placeholder,
    onChangeText,
    onPasswordChange,
    onDateChange,
    onYearChange,
    minAge,
    ...rest
}: InputProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [internalDate, setInternalDate] = useState(new Date());

    if (type === 'date') {
        const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (event.type === 'set' && selectedDate) {
                setInternalDate(selectedDate);
                
                const dia = String(selectedDate.getDate()).padStart(2, '0');
                const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const ano = selectedDate.getFullYear();
                const formattedDate = `${dia}/${mes}/${ano}`;
                
                if (type === 'date' && onDateChange) {
                    let error = '';
                    if (minAge) {
                        const hoje = new Date();
                        const dataMinima = new Date();
                        dataMinima.setFullYear(hoje.getFullYear() - minAge);
    
                        if (selectedDate > dataMinima) {
                            error = `A idade mínima é de ${minAge} anos.`;
                        }
                    }
                    onDateChange({ date: formattedDate, error: error });
                }
            }
        };

        return (
            <View style={[label && styles.wrapperWithLabel, containerStyle]}>
                {label && <Text style={styles.label}>{label}</Text>}
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.container}>
                    <Text style={[styles.inputField, !value && { color: Colors.primaryLight }]}>
                        {value || placeholder}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker 
                        value={internalDate} 
                        mode="date" 
                        display="default" 
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                )}
            </View>
        );
    }
    const handleTextChange = (text: string) => {
        if (type === 'password' && onPasswordChange) {
            const criteria = {
                length: text.length >= 6,
                uppercase: /[A-Z]/.test(text),
                specialChar: /[!@#$%^&*(),.?":{}|<>_+-=]/.test(text),
            };
            onPasswordChange({ text, criteria });

        } else if (onChangeText) {
            let formattedText = text;
            if (type === 'cpf') {
                formattedText = text
                    .replace(/\D/g, '')
                    .slice(0, 11)
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            onChangeText(formattedText);
        }
    };

    return (
        <View style={[label && styles.wrapperWithLabel, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.container}>
                <TextInput
                    style={styles.inputField}
                    placeholderTextColor={Colors.primaryLight}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={handleTextChange}
                    {...rest}
                />
                {status && (
                    <TouchableOpacity onPress={onEyeIconPress}>
                        <EyeIcon status={status} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}