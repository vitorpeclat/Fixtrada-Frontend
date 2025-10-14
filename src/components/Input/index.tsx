import { EyeIcon } from "@/components/EyeIcon";
import { strings } from "@/languages"; // <-- MUDANÇA 1: Importar as strings
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from "react";
import { Modal, Platform, Pressable, StyleProp, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";
import { styles } from "./styles";

// --- INTERFACES --- (sem alterações)

interface PasswordCriteria {
    length: boolean;
    uppercase: boolean;
    specialChar: boolean;
}
interface PasswordChangeDetails {
    text: string;
    criteria: PasswordCriteria;
}
interface DateChangeDetails {
    date: string;
    error: string;
}
interface YearChangeDetails {
    year: string;
}
interface FuelChangeDetails {
    fuel: string;
}

interface InputProps extends TextInputProps {
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    status?: FilterStatus;
    error?: string | null;
    onEyeIconPress?: () => void;
    type?: 'text' | 'password' | 'date' | 'cpf' | 'placa' | 'age' | 'year' | 'fuel' | 'km';
    onPasswordChange?: (details: PasswordChangeDetails) => void;
    onDateChange?: (details: DateChangeDetails) => void;
    onYearChange?: (details: YearChangeDetails) => void;
    onFuelChange?: (details: FuelChangeDetails) => void;
    minAge?: number;
}

const fuelOptions = Object.values(strings.inputComponent.fuelOptions);

export function Input({
    label,
    containerStyle,
    status,
    error = null,
    onEyeIconPress,
    type = 'text',
    value,
    placeholder,
    onChangeText,
    onPasswordChange,
    onDateChange,
    onYearChange,
    onFuelChange, 
    minAge,
    ...rest
}: InputProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [internalDate, setInternalDate] = useState(new Date());
    const [showFuelPicker, setShowFuelPicker] = useState(false);

    if (type === 'date' || type === 'age') {
        const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (event.type === 'set' && selectedDate) {
                setInternalDate(selectedDate);
                const dia = String(selectedDate.getDate()).padStart(2, '0');
                const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const ano = selectedDate.getFullYear();
                const formattedDate = `${dia}/${mes}/${ano}`;

                if (onDateChange) {
                    let error = '';
                    const effectiveMinAge = type === 'age' ? (minAge || 18) : minAge;

                    if (effectiveMinAge) {
                        const hoje = new Date();
                        const dataMinima = new Date(hoje.getFullYear() - effectiveMinAge, hoje.getMonth(), hoje.getDate());
                        
                        if (selectedDate > dataMinima) {
                            error = strings.inputComponent.minAgeError(effectiveMinAge);
                        }
                    }
                    onDateChange({ date: formattedDate, error: error });
                }
            }
        };
        return (
            <View style={[label && styles.wrapperWithLabel, containerStyle]}>
                {label && <Text style={styles.label}>{label}</Text>}
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.container, error ? styles.containerError : null]}>
                    <Text style={[styles.inputField, !value && { color: Colors.primaryLight }]}>
                        {value || placeholder}
                    </Text>
                </TouchableOpacity>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {showDatePicker && (
                    <DateTimePicker value={internalDate} mode="date" display="default" onChange={handleDateChange} maximumDate={new Date()} />
                )}
            </View>
        );
    }

    if (type === 'fuel') {
        const handleSelectFuel = (fuel: string) => {
            if (onFuelChange) {
                onFuelChange({ fuel });
            }
            setShowFuelPicker(false);
        };

        return (
            <View style={[label && styles.wrapperWithLabel, containerStyle]}>
                {label && <Text style={styles.label}>{label}</Text>}
                <TouchableOpacity onPress={() => setShowFuelPicker(true)} style={[styles.container, error ? styles.containerError : null]}>
                    <Text style={[styles.inputField, !value && { color: Colors.primaryLight }]}>
                        {value || placeholder}
                    </Text>
                </TouchableOpacity>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Modal
                    transparent={true}
                    visible={showFuelPicker}
                    animationType="fade"
                    onRequestClose={() => setShowFuelPicker(false)}
                >
                    <Pressable style={styles.modalOverlay} onPress={() => setShowFuelPicker(false)}>
                        <View style={styles.modalContent}>
                            {fuelOptions.map((option) => (
                                <TouchableOpacity key={option} style={styles.modalOption} onPress={() => handleSelectFuel(option)}>
                                    <Text style={styles.modalOptionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Pressable>
                </Modal>
            </View>
        );
    }

    const handleTextChange = (text: string) => {
        if (type === 'password' && onPasswordChange) {
            const criteria = { length: text.length >= 6, uppercase: /[A-Z]/.test(text), specialChar: /[!@#$%^&*(),.?":{}|<>_+-=]/.test(text) };
            onPasswordChange({ text, criteria });
            return;
        }

        if (type === 'year' && onYearChange) {
            const numericText = text.replace(/[^0-9]/g, "");
            const currentYear = new Date().getFullYear();
            if (numericText.length === 4) {
                const inputYear = parseInt(numericText, 10);
                if (inputYear > currentYear) {
                    onYearChange({ year: String(currentYear) });
                    return;
                }
            }
            onYearChange({ year: numericText });
            return;
        }

        let formattedText = text;
        if (type === 'cpf') {
            formattedText = text.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else if (type === 'placa') {
            const cleanedText = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
            if (cleanedText.length > 3) {
                formattedText = cleanedText.replace(/([A-Z0-9]{3})([A-Z0-9]+)/, '$1-$2');
            } else {
                formattedText = cleanedText;
            }
        } else if (type === 'km') {
            formattedText = text.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }


        if (onChangeText) {
            onChangeText(formattedText);
        }
    };

    return (
        <View style={[label && styles.wrapperWithLabel, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View>
                <View style={[styles.container, error ? styles.containerError : null]}>
                    <TextInput
                        style={styles.inputField}
                        placeholderTextColor={Colors.primaryLight}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={handleTextChange}
                        keyboardType={type === 'year' || type === 'cpf' || type === 'km' ? 'number-pad' : 'default'}
                        maxLength={type === 'placa' ? 8 : (type === 'year' ? 4 : (type === 'cpf' ? 14 : undefined))}
                        autoCapitalize={type === 'placa' ? 'characters' : 'none'}
                        {...rest}
                    />
                    {status && (
                        <TouchableOpacity onPress={onEyeIconPress}>
                            <EyeIcon status={status} />
                        </TouchableOpacity>
                    )}
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
        </View>
    );
}