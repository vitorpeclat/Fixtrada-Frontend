import { Feather } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Platform, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import {
    AnimatedView,
    AnimationProvider,
    AppText,
    Input,
    KeyboardShiftView
} from '@/components';
import { Colors } from '@/theme/colors';
import { styles } from './styles';

type ScreenAnimation = 'fadeInUp' | 'fadeInDown' | 'fadeOutUp' | 'fadeOutDown';

export default function RecuperarCadastro() {
    const [cpf, setCpf] = useState('');
    // States para o DatePicker
    const [dataNascimento, setDataNascimento] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [erroData, setErroData] = useState('');

    const formRef = useRef<Animatable.View & { shake: (duration: number) => void }>(null);

    // Lógica de animação padrão do projeto
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

    const handleNavigatePush = (path: string, exitAnimation: ScreenAnimation) => {
        setAnimationType(exitAnimation);
        setAnimationKey(prevKey => prevKey + 1);
        setTimeout(() => {
            router.push(path as any);
        }, 600);
    };

    const handleNavigateBack = (exitAnimation: ScreenAnimation) => {
        setAnimationType(exitAnimation);
        setAnimationKey(prevKey => prevKey + 1);
        setTimeout(() => {
            if (router.canGoBack()) {
                router.back();
            }
        }, 600);
    };
    
    // Função para formatar o CPF
    const handleCpfChange = (text: string) => {
        const formattedText = text.replace(/\D/g, '').slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        setCpf(formattedText);
    };

    // Função do DatePicker, igual à da tela de Cadastro
    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (event.type === 'set' && selectedDate) {
            const hoje = new Date();
            const dataMinima = new Date();
            dataMinima.setFullYear(hoje.getFullYear() - 10);
            
            setDate(selectedDate);
            const dia = String(selectedDate.getDate()).padStart(2, '0');
            const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const ano = selectedDate.getFullYear();
            setDataNascimento(`${dia}/${mes}/${ano}`);
            
            if (selectedDate > dataMinima) {
                setErroData("Apenas para maiores de 10 anos.");
            } else {
                setErroData('');
            }
        }
    };
    
    function handleRecuperar() {
        if (!cpf.trim() || !dataNascimento.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            formRef.current?.shake(800);
            return;
        }

        if (erroData) {
            Alert.alert("Data Inválida", "Corrija a data de nascimento para continuar.");
            formRef.current?.shake(800);
            return;
        }
        
        // Lógica para buscar o cadastro na API viria aqui
        Alert.alert('Sucesso', 'Cadastro encontrado! Agora crie uma nova senha.');
        
        // Navega para a página de criar senha após o alerta
        handleNavigatePush('/CriarSenhaRecuperada', 'fadeOutUp');
    }

    return (
        <AnimationProvider key={animationKey} defaultAnimation={animationType}>
            <KeyboardShiftView style={styles.container}>
                <View style={styles.content}>

                    <AnimatedView style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => handleNavigateBack('fadeOutDown')}
                            activeOpacity={0.7}>
                            <Feather name="chevron-left" size={24} color={Colors.primary} />
                            <AppText style={styles.backButtonText}>voltar ao login</AppText>
                        </TouchableOpacity>
                    </AnimatedView>

                    <AnimatedView>
                        <AppText style={styles.title}>Recuperar Cadastro</AppText>
                    </AnimatedView>

                    <Animatable.View ref={formRef} style={styles.form}>
                        {/* CPF e Data de Nascimento em linha */}
                        <AnimatedView style={styles.row}>
                            <Input
                                label="CPF"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChangeText={handleCpfChange}
                                keyboardType="numeric"
                                maxLength={14}
                                containerStyle={{ width: '48%' }}
                            />
                            <View style={{ width: '48%' }}>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                    <Input 
                                        label="Data Nasc." 
                                        placeholder="DD/MM/AAAA" 
                                        value={dataNascimento} 
                                        editable={false} 
                                    />
                                </TouchableOpacity>
                                {erroData ? <AppText style={styles.errorText}>{erroData}</AppText> : null}
                            </View>
                        </AnimatedView>

                        <AnimatedView style={{ width: '60%' }}>
                            <TouchableOpacity
                                style={[styles.button, (!cpf.trim() || !dataNascimento.trim()) && styles.buttonDisabled]}
                                onPress={handleRecuperar}
                                disabled={!cpf.trim() || !dataNascimento.trim()}
                                activeOpacity={0.7}
                            >
                                <AppText style={styles.buttonText}>Continuar</AppText>
                            </TouchableOpacity>
                        </AnimatedView>
                    </Animatable.View>

                    {showDatePicker && (
                        <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
                    )}
                </View>
            </KeyboardShiftView>
        </AnimationProvider>
    );
}