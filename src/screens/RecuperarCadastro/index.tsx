import { Feather } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import {
    AnimatedView,
    AnimationProvider,
    AppText,
    Input,
    KeyboardShiftView,
    useScreenAnimation
} from '@/components';
import { Colors } from '@/theme/colors';
import { styles } from './styles';

function RecuperarCadastroContent() {
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [erroData, setErroData] = useState('');
    const formRef = useRef<Animatable.View & { shake: (duration: number) => void }>(null);
    const { handleGoBack, handleNavigatePush, handleHardwareBackPress } = useScreenAnimation();

    // A função 'onChangeDate' e os states 'date' e 'showDatePicker' foram removidos.

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleHardwareBackPress);
        return () => backHandler.remove();
    }, [handleHardwareBackPress]);

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
        
        Alert.alert('Sucesso', 'Cadastro encontrado! Agora crie uma nova senha.');
        handleNavigatePush('/CriarSenhaRecuperada', 'fadeOutUp');
    }

    return (
        <KeyboardShiftView style={styles.container}>
            <View style={styles.content}>
                <AnimatedView style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => handleGoBack('fadeOutDown')}
                        activeOpacity={0.7}>
                        <Feather name="chevron-left" size={24} color={Colors.primary} />
                        <AppText style={styles.backButtonText}>voltar ao login</AppText>
                    </TouchableOpacity>
                </AnimatedView>

                <AnimatedView>
                    <AppText style={styles.title}>Recuperar Cadastro</AppText>
                </AnimatedView>

                <Animatable.View ref={formRef} style={styles.form}>
                    <AnimatedView style={styles.row}>
                        <Input
                            label="CPF"
                            placeholder="000.000.000-00"
                            value={cpf}
                            onChangeText={setCpf}
                            type="cpf"
                            keyboardType="numeric"
                            maxLength={14}
                            containerStyle={{ width: '48%' }}
                        />
                        <View style={{ width: '48%' }}>
                           <Input 
                                label="Data Nasc." 
                                placeholder="DD/MM/AAAA" 
                                value={dataNascimento}
                                type="date"
                                minAge={10} // Usando a validação de idade mínima
                                onDateChange={({ date, error }) => {
                                    setDataNascimento(date);
                                    setErroData(error);
                                }}
                           />
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
            </View>
        </KeyboardShiftView>
    );
}

export default function RecuperarCadastroScreen() {
    return (
        <AnimationProvider>
            <RecuperarCadastroContent />
        </AnimationProvider>
    );
}