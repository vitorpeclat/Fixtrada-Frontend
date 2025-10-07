import {
    AnimatedView,
    AnimationProvider,
    AppText,
    Button,
    Input,
    KeyboardShiftView,
} from '@/components'
import { Colors } from "@/theme/colors"
import { FilterStatus } from "@/types/FilterStatus"
import { Feather } from '@expo/vector-icons'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { router, useFocusEffect } from "expo-router"
import React, { useCallback, useRef, useState } from "react"
import { Alert, Platform, TouchableOpacity, View } from "react-native"
import * as Animatable from 'react-native-animatable'
import { styles } from "./styles"

const ValidationCriteria = ({ isMet, text }: { isMet: boolean, text: string }) => {
    const color = isMet ? Colors.success : Colors.gray
    const iconName = isMet ? "check-circle" : "circle"

    return (
        <View style={styles.criterionRow}>
            <Feather name={iconName} size={16} color={color} style={styles.criterionIcon} />
            <AppText style={[styles.criterionText, { color }]}>{text}</AppText>
        </View>
    )
}

type ScreenAnimation = 'fadeInUp' | 'fadeInDown' | 'fadeOutUp' | 'fadeOutDown';

export default function Cadastro() {
    const [usuLogin, setUsuLogin] = useState('')
    const [usuSenha, setUsuSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        specialChar: false,
    })
    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [erroData, setErroData] = useState('')
    const formRef = useRef<Animatable.View & { shake: (duration: number) => void }>(null)
    const [passwordStatus, setPasswordStatus] = useState(FilterStatus.HIDE)
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(FilterStatus.HIDE)
    const [usuNome, setUsuNome] = useState('')
    const [usuCpf, setUsuCpf] = useState('')
    const [usuDataNasc, setUsuDataNascimento] = useState('')
    const [animationKey, setAnimationKey] = useState(0)
    const [animationType, setAnimationType] = useState<ScreenAnimation>('fadeInUp')
    const isFirstRun = useRef(true)

    useFocusEffect(useCallback(() => { if (isFirstRun.current) { isFirstRun.current = false; setAnimationType('fadeInUp'); } else { setAnimationType('fadeInDown'); } setAnimationKey(prevKey => prevKey + 1); }, []));
    const handleGoBack = (exitAnimation: 'fadeOutUp' | 'fadeOutDown') => {
        setAnimationType(exitAnimation)
        setAnimationKey(prevKey => prevKey + 1)
        setTimeout(() => { if (router.canGoBack()) { router.back() } }, 600)
    }
    const handleTogglePasswordVisibility = () => setPasswordStatus(
        s => s === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
    )
    const handleToggleConfirmPasswordVisibility = () => setConfirmPasswordStatus(
        s => s === FilterStatus.HIDE ? FilterStatus.SHOW : FilterStatus.HIDE
    )
    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios')
        if (event.type === 'set' && selectedDate) {
            const hoje = new Date()
            const dataMinima = new Date()
            dataMinima.setFullYear(hoje.getFullYear() - 10); const currentDate = selectedDate;
            setDate(currentDate)
            const dia = String(currentDate.getDate()).padStart(2, '0')
            const mes = String(currentDate.getMonth() + 1).padStart(2, '0')
            const ano = currentDate.getFullYear()
            setUsuDataNascimento(`${dia}/${mes}/${ano}`)
            if (selectedDate > dataMinima) { setErroData("Apenas para maiores de 10 anos.")
            } else { setErroData('') } } 
        }
    const handleCpfChange = (text: string) => {
        const formattedText = text.replace(/\D/g, '').slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        setUsuCpf(formattedText)
    }

    const handlePasswordChange = (text: string) => {
        setUsuSenha(text)
        setPasswordCriteria({
            length: text.length >= 6,
            uppercase: /[A-Z]/.test(text),
            specialChar: /[!@#$%^&*(),.?":{}|<>_+-=]/.test(text),
        })
    }

    async function handleCadastro() {
        const campos = [usuNome, usuCpf, usuDataNasc, usuLogin, usuSenha, confirmarSenha]

        if (campos.some(campo => campo.trim() === '')) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos.")
            formRef.current?.shake(800)
            return
        }
        if (erroData) {
            Alert.alert("Data Inválida", "Corrija a data de nascimento para continuar.")
            formRef.current?.shake(800)
            return
        }
        if (!passwordCriteria.length || !passwordCriteria.uppercase || !passwordCriteria.specialChar) {
            Alert.alert("Senha Inválida", "Cumpra todos os requisitos de senha para continuar.")
            formRef.current?.shake(800)
            return
        }

        if (usuSenha !== confirmarSenha) {
            Alert.alert("Erro de Validação", "As senhas não coincidem.");
            formRef.current?.shake(800)
            return
        }
        try { const response = { ok: true, json: () => ({ message: "Cadastro realizado com sucesso!" }) }
        const data = await response.json()
        if (response.ok) { Alert.alert("Cadastro realizado!", data.message)
            handleGoBack('fadeOutUp')
        } else { Alert.alert("Falha no Cadastro", data.message)} 
        } 
        catch (error) { console.error("Erro na requisição:", error)
            Alert.alert("Erro", "Não foi possível conectar ao servidor.")
        }
    }

    return (
        <AnimationProvider key={animationKey} defaultAnimation={animationType}>
            <View style={styles.container}>
                <KeyboardShiftView style={styles.content}>

                    <AnimatedView style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={() => handleGoBack('fadeOutDown')} 
                            activeOpacity={0.7}><Feather 
                            name="chevron-left" 
                            size={24} 
                            color={Colors.primary} />
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
                                value={usuCpf} 
                                onChangeText={handleCpfChange} 
                                containerStyle={{ width: '48%' }} 
                                keyboardType="numeric" />
                                <View style={{ width: '48%' }}>
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                        <Input label="Data Nasc" placeholder="DD/MM/AAAA" value={usuDataNasc} editable={false} />
                                    </TouchableOpacity>{erroData ? 
                                    <AppText style={styles.errorText}>{erroData}</AppText> : null}
                                </View>
                        </AnimatedView>

                        <AnimatedView>
                            <Input 
                                label="Email" 
                                placeholder="exemplo@dominio.com" 
                                value={usuLogin} 
                                onChangeText={setUsuLogin} 
                                keyboardType="email-address" 
                                autoCapitalize="none" 
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
                                onChangeText={handlePasswordChange}
                            />
                            <View style={styles.criteriaContainer}>
                                <ValidationCriteria isMet={passwordCriteria.length} text="Pelo menos 6 caracteres" />
                                <ValidationCriteria isMet={passwordCriteria.uppercase} text="Uma letra maiúscula" />
                                <ValidationCriteria isMet={passwordCriteria.specialChar} text="Um caractere especial (!@#$)" />
                            </View>
                        </AnimatedView>

                        <AnimatedView>
                            <Input
                                label="Confirmar Senha"
                                value={confirmarSenha} onChangeText={setConfirmarSenha}
                                status={confirmPasswordStatus} onEyeIconPress={handleToggleConfirmPasswordVisibility} secureTextEntry={confirmPasswordStatus === FilterStatus.HIDE} containerStyle={{ width: '90%' }}
                            />
                        </AnimatedView>

                        <AnimatedView style={{ marginTop: 15 }}>
                            <Button title="Continuar cadastro" containerStyle={{ width: '60%' }} onPress={handleCadastro} />
                        </AnimatedView>
                    </Animatable.View>

                    {showDatePicker && (
                        <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
                    )}
                </KeyboardShiftView>
            </View>
        </AnimationProvider>
    );
}