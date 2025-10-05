import { AnimatedView, AnimationProvider } from "@/components/AnimationProvider";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { SquareIcon } from "@/components/CheckBoxIcon";
import { Input } from "@/components/Input";
import { KeyboardShiftView } from "@/components/KeyboardShiftView";
import { FilterStatus } from "@/types/FilterStatus";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';
import { styles } from "./styles";

type ScreenAnimation = 'fadeInUp' | 'fadeInDown' | 'fadeOutUp' | 'fadeOutDown';

export default function Login() {
    const [passwordStatus, setPasswordStatus] = useState(FilterStatus.HIDE);
    const [checkboxStatus, setCheckboxStatus] = useState(FilterStatus.UNCHECKED);
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    
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
        }, 600);
    };

    function handleTogglePasswordVisibility() {
        setPasswordStatus(prevState =>
            prevState === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
        );
    }

    function handleToggleCheckbox() {
        setCheckboxStatus(currentStatus =>
            currentStatus === FilterStatus.UNCHECKED
                ? FilterStatus.CHECKED
                : FilterStatus.UNCHECKED
        );
    }

    async function handleLogin() {
        try {
            const response = await fetch('http://192.168.15.16:3333/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("login efetuado com sucesso", data.message)
                Alert.alert("Login bem-sucedido!", data.message);
            } else {
                formRef.current?.shake(800); 
                Alert.alert("Falha no Login", data.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            formRef.current?.shake(800);
            Alert.alert("Erro", "Não foi possível conectar ao servidor.");
        }
    }

    return (
        <AnimationProvider key={animationKey} defaultAnimation={animationType}>
            <View style={styles.container}>
                <KeyboardShiftView style={styles.content}>

                    <AnimatedView>
                        <Image source={require("@/assets/logo-fixtrada.png")} style={styles.logo} resizeMode="contain" />
                    </AnimatedView>

                    <Animatable.View ref={formRef} style={styles.form}>
                        <AnimatedView>
                            <Input
                                label="Email"
                                placeholder="exemplo@domínio.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                containerStyle={{ width: '90%' }}
                                value={login}
                                onChangeText={setLogin}
                            />
                        </AnimatedView>

                        <AnimatedView>
                            <Input
                                label="Senha"
                                placeholder="Digite sua senha"
                                status={passwordStatus}
                                onEyeIconPress={handleTogglePasswordVisibility}
                                secureTextEntry={passwordStatus === FilterStatus.HIDE}
                                containerStyle={{ width: '90%' }}
                                value={senha}
                                onChangeText={setSenha}
                            />
                        </AnimatedView>
                        
                        <AnimatedView style={styles.row}>
                            <TouchableOpacity style={styles.checkboxContainer} onPress={handleToggleCheckbox} activeOpacity={0.7} >
                                <SquareIcon status={checkboxStatus} style={{ marginTop: 2 }}/>
                                <AppText>Lembre de mim</AppText>
                            </TouchableOpacity>
                            <AppText textAlign="right" onPress={() => Alert.alert("Funcionalidade", "Implementar recuperação de senha.")}>
                                Esqueci minha senha.
                            </AppText>
                        </AnimatedView>
                        
                        <AnimatedView style={{ marginBottom: 5 }}>
                            <Button
                                title="Logar-se"
                                containerStyle={{ width: '50%' }}
                                onPress={handleLogin}
                            />
                        </AnimatedView>

                        <AnimatedView>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => handleNavigatePush("/Cadastro", 'fadeOutUp')} >
                                <AppText>
                                    Não tem conta?{' '}
                                    <AppText fontWeight="800" underline>
                                        Cadastrar-se
                                    </AppText>
                                </AppText>
                            </TouchableOpacity>
                        </AnimatedView>
                    </Animatable.View>
                </KeyboardShiftView>
            </View>
        </AnimationProvider>
    );
}