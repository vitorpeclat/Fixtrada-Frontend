import { AnimatedView, AnimationProvider } from "@/components/AnimationProvider";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { KeyboardShiftView } from "@/components/KeyboardShiftView";
import { Colors } from "@/theme/colors";
import { FilterStatus } from "@/types/FilterStatus";
import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';
import { styles } from "./styles";

type ScreenAnimation = 'fadeInUp' | 'fadeInDown' | 'fadeOutUp' | 'fadeOutDown';

export default function Cadastro() {
    const [passwordStatus, setPasswordStatus] = useState(FilterStatus.HIDE);
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(FilterStatus.HIDE);
    const [usuNome, setUsuNome] = useState('');
    const [usuCpf, setUsuCpf] = useState('');
    const [usuDataNasc, setUsuDataNascimento] = useState('');
    const [usuLogin, setUsuLogin] = useState('');
    const [usuSenha, setUsuSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const [animationKey, setAnimationKey] = useState(0);
    const [animationType, setAnimationType] = useState<ScreenAnimation>('fadeInUp');
    const isFirstRun = useRef(true);
    const formRef = useRef<Animatable.View & { shake: (duration: number) => void }>(null);

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

    const handleNavigatePush = (path: string, exitAnimation: 'fadeOutUp' | 'fadeOutDown') => {
        setAnimationType(exitAnimation);
        setAnimationKey(prevKey => prevKey + 1);
        setTimeout(() => {
            router.push(path as any);
        }, 500);
    };

    const handleGoBack = (exitAnimation: 'fadeOutUp' | 'fadeOutDown') => {
        setAnimationType(exitAnimation);
        setAnimationKey(prevKey => prevKey + 1);
        setTimeout(() => {
            if (router.canGoBack()) {
                router.back();
            }
        }, 600);
    };

    function handleTogglePasswordVisibility() {
        setPasswordStatus(prevState =>
            prevState === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
        );
    }

    function handleToggleConfirmPasswordVisibility() {
        setConfirmPasswordStatus(prevState =>
            prevState === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
        );
    }

    function handleDataNascimentoChange(text: string) {
        let formattedText = text.replace(/\D/g, '');
        if (formattedText.length > 8) {
            formattedText = formattedText.slice(0, 8);
        }
        formattedText = formattedText.replace(/(\d{2})(\d)/, '$1/$2');
        formattedText = formattedText.replace(/(\d{2})(\d)/, '$1/$2');
        setUsuDataNascimento(formattedText);
    }

    function handleCpfChange(text: string) {
        let formattedText = text.replace(/\D/g, '');
        if (formattedText.length > 11) {
            formattedText = formattedText.slice(0, 11);
        }
        formattedText = formattedText.replace(/(\d{3})(\d)/, '$1.$2');
        formattedText = formattedText.replace(/(\d{3})(\d)/, '$1.$2');
        formattedText = formattedText.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        setUsuCpf(formattedText);
    }

    async function handleCadastro() {
        if (usuSenha !== confirmarSenha) {
            Alert.alert("Erro de Validação", "As senhas não coincidem.");
            return;
        }
        
        try {
            // Simulação de sucesso para teste da animação
            const response = { ok: true, json: () => ({ message: "Cadastro realizado com sucesso!" }) };
            const data = await response.json();

            if (response.ok) {
                Alert.alert("Cadastro realizado!", data.message);
                handleGoBack('fadeOutUp'); 
            } else {
                Alert.alert("Falha no Cadastro", data.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            Alert.alert("Erro", "Não foi possível conectar ao servidor.");
        }
    }

    return (
        <AnimationProvider key={animationKey} defaultAnimation={animationType}>
            <View style={styles.container}>
                <KeyboardShiftView style={styles.content}>
                    
                    <AnimatedView style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => handleGoBack('fadeOutDown')} activeOpacity={0.7}>
                            <Feather name="chevron-left" size={24} color={Colors.primary} />
                            <AppText style={styles.backButtonText}>voltar ao login</AppText>
                        </TouchableOpacity>
                    </AnimatedView>
                    
                    <AnimatedView style={{ marginBottom: 20 }}>
                        <AppText style={styles.title}>Cadastro Cliente</AppText>
                    </AnimatedView>

                    <Animatable.View ref={formRef} style={styles.form}>
                        <AnimatedView>
                            <Input 
                                label="Nome" 
                                placeholder="Digite seu nome completo" 
                                value={usuNome} onChangeText={setUsuNome} 
                                containerStyle={{ width: '90%' }} />
                        </AnimatedView>

                        <AnimatedView style={styles.row}>
                            <Input 
                                label="CPF" 
                                placeholder="000.000.000-00" 
                                value={usuCpf} onChangeText={handleCpfChange} 
                                containerStyle={{ width: '48%' }} 
                                keyboardType="numeric" />
                            <Input 
                                label="Data Nasc" 
                                placeholder="DD/MM/AAAA" 
                                value={usuDataNasc} onChangeText={handleDataNascimentoChange} 
                                containerStyle={{ width: '48%' }} 
                                keyboardType="numeric" />
                        </AnimatedView>

                        <AnimatedView>
                            <Input 
                                label="Email" 
                                placeholder="exemplo@dominio.com" 
                                value={usuLogin} onChangeText={setUsuLogin} 
                                keyboardType="email-address" autoCapitalize="none" 
                                containerStyle={{ width: '90%' }} />
                        </AnimatedView>
                        
                        <AnimatedView>
                            <Input
                                label="Senha"
                                placeholder="Crie uma senha forte"
                                status={passwordStatus}
                                onEyeIconPress={handleTogglePasswordVisibility}
                                secureTextEntry={passwordStatus === FilterStatus.HIDE}
                                containerStyle={{ width: '90%' }}
                                value={usuSenha}
                                onChangeText={setUsuSenha}
                            />
                        </AnimatedView>

                        <AnimatedView>
                            <Input
                                label="Confirmar Senha"
                                placeholder="Repita a senha"
                                status={confirmPasswordStatus}
                                onEyeIconPress={handleToggleConfirmPasswordVisibility}
                                secureTextEntry={confirmPasswordStatus === FilterStatus.HIDE}
                                containerStyle={{ width: '90%' }}
                                value={confirmarSenha}
                                onChangeText={setConfirmarSenha}
                            />
                        </AnimatedView>

                        <AnimatedView style={{ marginTop: 15 }}>
                            <Button
                                title="Continuar cadastro"
                                containerStyle={{ width: '60%' }}
                                onPress={handleCadastro}
                            />
                        </AnimatedView>
                    </Animatable.View>
                </KeyboardShiftView>
            </View>
        </AnimationProvider>
    );
}