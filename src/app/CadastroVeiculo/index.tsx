import { Feather } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import {
    AnimatedView,
    AnimationProvider,
    AppText,
    Button,
    Input,
    KeyboardShiftView,
} from '@/components';
import { Colors } from '@/theme/colors';
import { styles } from './styles';

type ScreenAnimation = 'fadeInUp' | 'fadeInDown' | 'fadeOutUp' | 'fadeOutDown';
type DateField = 'ano' | 'oleo' | 'pneu';

export default function CadastroVeiculo() {
    // State para os campos do formulário
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [ano, setAno] = useState('');
    const [quilometragem, setQuilometragem] = useState('');
    const [tipoCombustivel, setTipoCombustivel] = useState('');
    const [cor, setCor] = useState('');
    const [tracao, setTracao] = useState('');
    const [trocaOleo, setTrocaOleo] = useState('');
    const [trocaPneu, setTrocaPneu] = useState('');
    const [versao, setVersao] = useState('');

    const [showOptional, setShowOptional] = useState(false);
    const formRef = useRef<Animatable.View & { shake: (duration: number) => void }>(null);

    // Lógica de animação
    const [animationKey, setAnimationKey] = useState(0);
    const [animationType, setAnimationType] = useState<ScreenAnimation>('fadeInUp');
    const isFirstRun = useRef(true);
    
    // Lógica para os DatePickers
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [editingDate, setEditingDate] = useState<DateField | null>(null);

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

    const handleGoBack = (exitAnimation: ScreenAnimation = 'fadeOutDown') => {
        setAnimationType(exitAnimation);
        setAnimationKey(prevKey => prevKey + 1);
        setTimeout(() => {
            if (router.canGoBack()) router.back();
        }, 600);
    };

    const openDatePicker = (field: DateField) => {
        setEditingDate(field);
        setShowDatePicker(true);
    };

    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');

        if (event.type === 'set') {
            setDate(currentDate);
            const dia = String(currentDate.getDate()).padStart(2, '0');
            const mes = String(currentDate.getMonth() + 1).padStart(2, '0');
            const anoFormatado = currentDate.getFullYear();
            
            const dataCompleta = `${dia}/${mes}/${anoFormatado}`;

            switch (editingDate) {
                case 'ano':
                    setAno(anoFormatado.toString());
                    break;
                case 'oleo':
                    setTrocaOleo(dataCompleta);
                    break;
                case 'pneu':
                    setTrocaPneu(dataCompleta);
                    break;
            }
        }
    };

    const handleCadastro = () => {
        const camposObrigatorios = [marca, modelo, ano, quilometragem, tipoCombustivel, cor];
        if (camposObrigatorios.some(campo => !campo.trim())) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
            formRef.current?.shake(800);
            return;
        }
        // Lógica de cadastro da API viria aqui
        Alert.alert('Sucesso!', 'Veículo cadastrado com sucesso.');
        handleGoBack('fadeOutUp');
    };

    return (
        <AnimationProvider key={animationKey} defaultAnimation={animationType}>
            <KeyboardShiftView style={styles.container}>
                <AnimatedView style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => handleGoBack()} activeOpacity={0.7}>
                        <Feather name="chevron-left" size={24} color={Colors.primary} />
                        <AppText style={styles.backButtonText}>voltar ao cadastro</AppText>
                    </TouchableOpacity>
                </AnimatedView>
                
                <AppText style={styles.title}>Cadastro de Veículo</AppText>
                
                <ScrollView style={{width: '100%'}} contentContainerStyle={styles.content}>
                    <Animatable.View ref={formRef} style={styles.form}>
                        {/* Campos Obrigatórios */}
                        <Input label="Marca" placeholder="Ex: Volkswagen" value={marca} onChangeText={setMarca} containerStyle={{ width: '90%' }} />
                        <Input label="Modelo" placeholder="Ex: Gol" value={modelo} onChangeText={setModelo} containerStyle={{ width: '90%' }} />
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => openDatePicker('ano')} style={{ width: '48%' }}>
                                {/* ÍCONE REMOVIDO DA LINHA ABAIXO */}
                                <Input label="Ano" placeholder="AAAA" value={ano} editable={false} />
                            </TouchableOpacity>
                            <Input label="Quilometragem" placeholder="Ex: 50000" value={quilometragem} onChangeText={setQuilometragem} keyboardType="number-pad" containerStyle={{ width: '48%' }} />
                        </View>
                        <Input label="Tipo de Combustível" placeholder="Ex: Gasolina, Flex" value={tipoCombustivel} onChangeText={setTipoCombustivel} containerStyle={{ width: '90%' }} />
                        <Input label="Cor" placeholder="Ex: Preto" value={cor} onChangeText={setCor} containerStyle={{ width: '90%' }} />

                        {/* Botão para mostrar/ocultar opcionais */}
                        <TouchableOpacity style={styles.optionalToggle} onPress={() => setShowOptional(!showOptional)} activeOpacity={0.7}>
                            <Feather name={showOptional ? "minus" : "plus"} size={20} color={Colors.secondary} />
                            <AppText style={styles.optionalText}>Dados opcionais</AppText>
                        </TouchableOpacity>

                        {/* Campos Opcionais */}
                        {showOptional && (
                            <>
                                <AppText style={styles.optionalSectionTitle}>- Dados opcionais</AppText>
                                <Input label="Tração" placeholder="Ex: 4x4" value={tracao} onChangeText={setTracao} containerStyle={{ width: '90%' }} />
                                
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => openDatePicker('oleo')} style={{ width: '48%' }}>
                                        <Input label="Troca de óleo" placeholder="dd/mm/aaaa" value={trocaOleo} editable={false} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => openDatePicker('pneu')} style={{ width: '48%' }}>
                                        <Input label="Troca de pneu" placeholder="dd/mm/aaaa" value={trocaPneu} editable={false} />
                                    </TouchableOpacity>
                                </View>

                                <Input label="Versão" placeholder="Ex: 1.6 MSI" value={versao} onChangeText={setVersao} containerStyle={{ width: '90%' }} />
                            </>
                        )}
                    </Animatable.View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button title="Cadastrar-se" onPress={handleCadastro} containerStyle={{ width: '60%' }} />
                </View>

                {showDatePicker && (
                    <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
                )}
            </KeyboardShiftView>
        </AnimationProvider>
    );
}