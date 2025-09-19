import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { KeyboardShiftView } from "@/components/KeyboardShiftView";
import { FilterStatus } from "@/types/FilterStatus";
import { router } from "expo-router";
import { styles } from "./styles";

export default function Cadastro() {
    const [passwordStatus, setPasswordStatus] = useState(FilterStatus.HIDE);
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(FilterStatus.HIDE);

    const [usuNome, setUsuNome] = useState('');
    const [usuCpf, setUsuCpf] = useState('');
    const [usuDataNasc, setUsuDataNascimento] = useState('');
    const [usuLogin, setUsuLogin] = useState('');
    const [usuSenha, setUsuSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    function togglePassword() {
        setPasswordStatus((p) => (p === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE));
    }
    function toggleConfirmPassword() {
        setConfirmPasswordStatus((p) => (p === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE));
    }

    function handleCpfChange(text: string) {
        let formattedText = text.replace(/\D/g, ''); // Remove tudo que não for dígito
        if (formattedText.length > 11) {
            formattedText = formattedText.slice(0, 11);
        }
        formattedText = formattedText.replace(/(\d{3})(\d)/, '$1.$2');
        formattedText = formattedText.replace(/(\d{3})(\d)/, '$1.$2');
        formattedText = formattedText.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        setUsuCpf(formattedText);
    }

    function handleDataNascimentoChange(text: string) {
        let formattedText = text.replace(/\D/g, ''); // Remove tudo que não for dígito
        if (formattedText.length > 8) {
            formattedText = formattedText.slice(0, 8);
        }
        formattedText = formattedText.replace(/(\d{2})(\d)/, '$1/$2');
        formattedText = formattedText.replace(/(\d{2})(\d)/, '$1/$2');
        setUsuDataNascimento(formattedText);
    }

    async function handleCadastro() {
        if (usuSenha !== confirmarSenha) {
            Alert.alert("Erro de Validação", "As senhas não coincidem.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(usuLogin)) {
            Alert.alert("Erro de Validação", "Por favor, insira um email válido.");
            return;
        }

        const dataNascimentoParts = usuDataNasc.split('/');
        if (dataNascimentoParts.length !== 3) {
            Alert.alert("Erro de Validação", "Formato de data de nascimento inválido. Use dd/mm/aaaa.");
            return;
        }

        const [dia, mes, ano] = dataNascimentoParts;

        const dataFormatada = `${ano}-${mes}-${dia}`;
        console.log(dataFormatada)
        const dataValida = new Date(dataFormatada);

        if (isNaN(dataValida.getTime())) {
            Alert.alert("Erro de Validação", "A data de nascimento é inválida.");
            return;
        }

        try {
            const response = await fetch('http://192.168.15.16:3333/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuNome,
                    usuCpf: usuCpf.replace(/\D/g, ''), // Remove a máscara antes de enviar
                    usuDataNasc: dataFormatada,
                    usuLogin,
                    usuSenha,
                }),
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                Alert.alert("Cadastro realizado!", data.message);
                router.push("/Login");
            } else {
                Alert.alert("Falha no Cadastro", data.message);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            Alert.alert("Erro", "Não foi possível conectar ao servidor.");
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardShiftView style={styles.keyboardWrapper}>
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <Image source={require("@/assets/logo-fixtrada.png")} style={styles.logo} resizeMode="contain" />
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/Login")}>
                        <Text style={styles.backText}>{"< voltar ao login"}</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Cadastro Cliente</Text>
                    <View style={styles.form}>
                        <Input
                            label="Nome"
                            placeholder="Seu nome completo"
                            autoCapitalize="words"
                            containerStyle={styles.inputContainer}
                            value={usuNome}
                            onChangeText={setUsuNome}
                        />
                        <Input
                            label="CPF"
                            placeholder="000.000.000-00"
                            keyboardType="numeric"
                            containerStyle={styles.inputContainer}
                            value={usuCpf}
                            onChangeText={handleCpfChange}
                        />
                        <Input
                            label="Data de Nascimento"
                            placeholder="dd/mm/aaaa"
                            keyboardType="numeric"
                            containerStyle={styles.inputContainer}
                            value={usuDataNasc}
                            onChangeText={handleDataNascimentoChange}
                        />
                        <Input
                            label="Email"
                            placeholder="exemplo@dominio.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            containerStyle={styles.inputContainer}
                            value={usuLogin}
                            onChangeText={setUsuLogin}
                        />
                        <Input
                            label="Senha"
                            placeholder="Digite sua senha"
                            status={passwordStatus}
                            secureTextEntry={passwordStatus === FilterStatus.HIDE}
                            onEyeIconPress={togglePassword}
                            containerStyle={styles.inputContainer}
                            value={usuSenha}
                            onChangeText={setUsuSenha}
                        />
                        <Input
                            label="Confirmar Senha"
                            placeholder="Repita a senha"
                            status={confirmPasswordStatus}
                            secureTextEntry={confirmPasswordStatus === FilterStatus.HIDE}
                            onEyeIconPress={toggleConfirmPassword}
                            containerStyle={styles.lastInputContainer}
                            value={confirmarSenha}
                            onChangeText={setConfirmarSenha}
                        />
                        <Button 
                            title="Continuar cadastro" 
                            containerStyle={styles.submitBtn} 
                            onPress={handleCadastro} 
                        />
                    </View>
                </ScrollView>
            </KeyboardShiftView>
        </View>
    );
}