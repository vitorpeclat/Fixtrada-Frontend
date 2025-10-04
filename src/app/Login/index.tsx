import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { SquareIcon } from "@/components/CheckBoxIcon";
import { Input } from "@/components/Input";
import { KeyboardShiftView } from "@/components/KeyboardShiftView";
import { FilterStatus } from "@/types/FilterStatus";
import { useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import { styles } from "./styles";

export default function Login() {
    const [passwordStatus, setPasswordStatus] = useState(FilterStatus.HIDE);
    const [checkboxStatus, setCheckboxStatus] = useState(FilterStatus.UNCHECKED);
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("login efetuado com sucesso", data.message)
                Alert.alert("Login bem-sucedido!", data.message);
                // Salvar o token e redirecionar o usuário
            } else {
                console.log(data.message)
                Alert.alert("Falha no Login", data.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            Alert.alert("Erro", "Não foi possível conectar ao servidor.");
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardShiftView style={styles.content}>
                <Image source={require("@/assets/logo-fixtrada.png")} style={styles.logo} resizeMode="contain" />
                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="exemplo@domínio.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        containerStyle={{ width: '90%' }}
                        value={login}
                        onChangeText={setLogin}
                    />
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
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.checkboxContainer} onPress={handleToggleCheckbox}>
                            <SquareIcon status={checkboxStatus} style={{ marginTop: 2 }}/>
                            <AppText>
                                Lembre de mim
                            </AppText>
                        </TouchableOpacity>
                        {/* A linha abaixo foi corrigida para não levar para /Cadastro, talvez para /EsqueciSenha */}
                        <AppText textAlign="right" onPress={() => Alert.alert("Funcionalidade", "Implementar recuperação de senha.")}>
                            Esqueci minha senha.
                        </AppText>
                    </View>
                    <Button
                        title="Logar-se"
                        containerStyle={{ width: '50%' }}
                        onPress={handleLogin}
                    />
                    {/* Este é o gatilho da navegação. Nenhuma mudança necessária aqui! */}
                    <AppText onPress={() => router.push("/Cadastro")}>
                        Não tem conta?{' '}
                        <AppText fontWeight="800" underline>
                            Cadastrar-se
                        </AppText>
                    </AppText>
                </View>
            </KeyboardShiftView>
        </View>
    );
}