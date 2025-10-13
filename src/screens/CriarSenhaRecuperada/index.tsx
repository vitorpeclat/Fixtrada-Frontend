import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import {
    AnimatedView,
    AnimationProvider,
    AppText,
    Button,
    Input,
    KeyboardShiftView,
    PasswordValidation,
    useScreenAnimation
} from '@/components';
import { Colors } from '@/theme/colors';
import { FilterStatus } from '@/types/FilterStatus';
import { styles } from './styles';

function CriarSenhaRecuperadaContent() {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    
    // 1. Unificamos o estado de visibilidade da senha
    const [passwordVisibility, setPasswordVisibility] = useState(FilterStatus.HIDE);
    
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        specialChar: false,
        match: false,
    });
    const formRef = useRef<Animatable.View & { shake: (duration: number) => void }>(null);
    const { handleNavigateReplace, handleHardwareBackPress } = useScreenAnimation();

    useEffect(() => {
        // Usa a função do provedor para o botão de voltar do hardware
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleHardwareBackPress);
        return () => backHandler.remove();
    }, [handleHardwareBackPress]);

    useEffect(() => {
        const arePasswordsMatching = novaSenha.length > 0 && novaSenha === confirmarSenha;
        setPasswordCriteria(prev => ({ ...prev, match: arePasswordsMatching }));
    }, [novaSenha, confirmarSenha]);

    // 2. Criamos uma única função para alternar a visibilidade
    const togglePasswordVisibility = () => {
        setPasswordVisibility(s => s === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE);
    };

    function handleSavePassword() {
        if (!novaSenha.trim() || !confirmarSenha.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            formRef.current?.shake(800);
            return;
        }
        if (!passwordCriteria.length || !passwordCriteria.uppercase || !passwordCriteria.specialChar || !passwordCriteria.match) {
            Alert.alert("Senha Inválida", "A nova senha deve cumprir todos os requisitos.");
            formRef.current?.shake(800);
            return;
        }
        Alert.alert('Sucesso!', 'Sua senha foi alterada. Faça o login com sua nova senha.');
        handleNavigateReplace('/Login', 'fadeOutUp');
    }

    return (
        <KeyboardShiftView style={styles.container}>
            <View style={styles.content}>
                <AnimatedView style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => handleNavigateReplace('/Login', 'fadeOutDown')}
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
                            type="password"
                            onPasswordChange={({ text, criteria }) => {
                                setNovaSenha(text);
                                setPasswordCriteria(prev => ({ ...prev, ...criteria }));
                            }}
                            containerStyle={{ width: '90%' }}
                            status={passwordVisibility}
                            onEyeIconPress={togglePasswordVisibility}
                            secureTextEntry={passwordVisibility === FilterStatus.HIDE}
                        />
                        <PasswordValidation criteria={passwordCriteria} />
                    </AnimatedView>

                    <AnimatedView>
                        <Input
                            label="Confirmar Nova Senha"
                            placeholder="Repita a nova senha"
                            value={confirmarSenha}
                            onChangeText={setConfirmarSenha}
                            containerStyle={{ width: '90%' }}
                            type="password" // Adicionado para consistência
                            // 3. Usando o mesmo estado e a mesma função aqui
                            status={passwordVisibility}
                            onEyeIconPress={togglePasswordVisibility}
                            secureTextEntry={passwordVisibility === FilterStatus.HIDE}
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
    );
}

export default function CriarSenhaRecuperadaScreen() {
    return (
        <AnimationProvider>
            <CriarSenhaRecuperadaContent />
        </AnimationProvider>
    );
}