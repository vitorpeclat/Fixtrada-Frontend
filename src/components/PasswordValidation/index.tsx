import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { strings } from '@/languages'; // <-- IMPLEMENTAÇÃO
import { Colors } from '@/theme/colors';
import { styles } from './styles';

interface PasswordCriteria {
    length: boolean;
    uppercase: boolean;
    specialChar: boolean;
    match?: boolean;
}

const ValidationCriteria = ({ isMet, text }: { isMet: boolean, text: string }) => {
    const color = isMet ? Colors.success : Colors.gray;
    const iconName = isMet ? "check-circle" : "circle";
    return (
        <View style={styles.criterionRow}>
            <Feather name={iconName} size={16} color={color} style={styles.criterionIcon} />
            <AppText style={[styles.criterionText, { color }]}>{text}</AppText>
        </View>
    );
};

export const PasswordValidation = ({ criteria }: { criteria: PasswordCriteria }) => (
    <View style={styles.criteriaContainer}>
        <ValidationCriteria isMet={criteria.length} text={strings.passwordValidation.length} />
        <ValidationCriteria isMet={criteria.uppercase} text={strings.passwordValidation.uppercase} />
        <ValidationCriteria isMet={criteria.specialChar} text={strings.passwordValidation.specialChar} />
        {criteria.match !== undefined && (
            <ValidationCriteria isMet={criteria.match} text={strings.passwordValidation.match} />
        )}
    </View>
);