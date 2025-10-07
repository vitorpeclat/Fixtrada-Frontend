import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import {
    AnimatedView,
    AnimationProvider,
    AppText,
    Button,
    Input,
    KeyboardShiftView
} from '@/components';
import { Colors } from '@/theme/colors';
import { FilterStatus } from '@/types/FilterStatus';
import { styles } from './styles';

// Componente para exibir os critérios da senha (copiado do Cadastro)
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

type ScreenAnimation = 'fadeInUp' | 'fadeInDown' | 'fadeOutUp' | 'fadeOutDown';

export default function CriarSenhaRecuperada() {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [passwordStatus, setPasswordStatus] = useState(FilterStatus.HIDE);
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(FilterStatus.HIDE);
    // State para os critérios da senha
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        specialChar: false,
    });
    
    const formRef = useRef<Animatable.View & { shake: (duration: number) => void }>(null);

    // Lógica de animação
    const [animationKey, setAnimationKey] = useState(0);
    const [animationType, setAnimationType] = useState<ScreenAnimation>('fadeInUp');
    const isFirstRun = useRef(true);

    useFocusEffect(
        useCallback(() => {
            if (isFirstRun.current) {
                isFirstRun.current = false;
                setAnimationType('fadeInUp');
            } else {
                setAnimationType('fadeInDown');
            }
            setAnimationKey(prevKey => prevKey + 1);
        }, [])
    );

    const handleGoToLogin = (exitAnimation: ScreenAnimation = 'fadeOutDown') => {
        setAnimationType(exitAnimation);
        setAnimationKey(prevKey => prevKey + 1);
        setTimeout(() => {
            router.replace('/Login'); 
        }, 600);
    };

    // Função para validar a senha em tempo real
    const handlePasswordChange = (text: string) => {
        setNovaSenha(text);
        setPasswordCriteria({
            length: text.length >= 6,
            uppercase: /[A-Z]/.test(text),
            specialChar: /[!@#$%^&*(),.?":{}|<>_+-=]/.test(text),
        });
    };
    
    function handleSavePassword() {
        if (!novaSenha.trim() || !confirmarSenha.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            formRef.current?.shake(800);
            return;
        }

        // Validação dos critérios da senha
        if (!passwordCriteria.length || !passwordCriteria.uppercase || !passwordCriteria.specialChar) {
            Alert.alert("Senha Inválida", "A nova senha deve cumprir todos os requisitos.");
            formRef.current?.shake(800);
            return;
        }

        if (novaSenha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            formRef.current?.shake(800);
            return;
        }

        Alert.alert('Sucesso!', 'Sua senha foi alterada. Faça o login com sua nova senha.');
        handleGoToLogin('fadeOutUp');
    }

    return (
        <AnimationProvider key={animationKey} defaultAnimation={animationType}>
            <KeyboardShiftView style={styles.container}>
                <View style={styles.content}>
                    <AnimatedView style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => handleGoToLogin('fadeOutDown')}
                            activeOpacity={0.7}>
                            <Feather name="chevron-left" size={24} color={Colors.primary} />
                            <AppText style={styles.backButtonText}>voltar ao login</AppText>
                        </TouchableOpacity>
                    </AnimatedView>

                    <AnimatedView>
                        <AppText style={styles.title}>Criar Nova Senha</AppText>
                    </AnimatedView>

                    <Animatable.View ref={formRef} style={styles.form}>
                        <AnimatedView>
                            <Input
                                label="Nova Senha"
                                placeholder="Crie uma senha forte"
                                value={novaSenha}
                                onChangeText={handlePasswordChange} 
                                containerStyle={{ width: '90%' }}
                                status={passwordStatus}
                                onEyeIconPress={() => setPasswordStatus(s => s === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE)}
                                secureTextEntry={passwordStatus === FilterStatus.HIDE}
                            />
                            <View style={styles.criteriaContainer}>
                                <ValidationCriteria isMet={passwordCriteria.length} text="Pelo menos 6 caracteres" />
                                <ValidationCriteria isMet={passwordCriteria.uppercase} text="Uma letra maiúscula" />
                                <ValidationCriteria isMet={passwordCriteria.specialChar} text="Um caractere especial (!@#$)" />
                            </View>
                        </AnimatedView>
                        
                        <AnimatedView>
                            <Input
                                label="Confirmar Nova Senha"
                                placeholder=""
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                                containerStyle={{ width: '90%' }}
                                status={confirmPasswordStatus}
                                onEyeIconPress={() => setConfirmPasswordStatus(s => s === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE)}
                                secureTextEntry={confirmPasswordStatus === FilterStatus.HIDE}
                            />
                        </AnimatedView>

                        <AnimatedView>
                            <Button
                                title="Salvar Senha"
                                onPress={handleSavePassword}
                                containerStyle={{ width: '60%' }}
                            />
                        </AnimatedView>
                    </Animatable.View>
                </View>
            </KeyboardShiftView>
        </AnimationProvider>
    );
}