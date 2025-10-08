import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import {
    AnimatedView,
    AnimationProvider,
    AppText,
    Button,
    Input,
    useScreenAnimation
} from '@/components';
import { Colors } from '@/theme/colors';
import { styles } from './styles';

type AnimatableViewRef = Animatable.View & View & {
    fadeOutUp: (duration: number) => void;
};

function CadastroVeiculoContent() {
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
    const { handleGoBack, handleHardwareBackPress } = useScreenAnimation();
    
    const optionalRef1 = useRef<AnimatableViewRef>(null);
    const optionalRef2 = useRef<AnimatableViewRef>(null);

    const handleCadastro = () => {  };

    const handleHideOptional = () => {
        optionalRef1.current?.fadeOutUp(200);
        setTimeout(() => optionalRef2.current?.fadeOutUp(200), 100);

        setTimeout(() => {
            setShowOptional(false);
        }, 400); 
    };
    
    // --- NOVA FUNÇÃO DE VALIDAÇÃO PARA O ANO ---
    const handleAnoChange = (text: string) => {
        // Garante que apenas números sejam inseridos
        const numericText = text.replace(/[^0-9]/g, '');
        const currentYear = new Date().getFullYear();

        // Valida se o ano inserido é maior que o ano atual
        if (numericText.length === 4) {
            const inputYear = parseInt(numericText, 10);
            if (inputYear > currentYear) {
                // Se for maior, define o ano para o ano atual
                setAno(String(currentYear));
                return;
            }
        }
        // Atualiza o estado com o texto numérico
        setAno(numericText);
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleHardwareBackPress);
        return () => backHandler.remove();
    }, [handleHardwareBackPress]);

    return (
        <View style={styles.container}>
            <AnimatedView style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => handleGoBack('fadeOutDown')} activeOpacity={0.7}>
                    <Feather name="chevron-left" size={24} color={Colors.primary} />
                    <AppText style={styles.backButtonText}>voltar</AppText>
                </TouchableOpacity>
            </AnimatedView>
            
            <AnimatedView>
                <AppText style={styles.title}>Cadastro de Veículo</AppText>
            </AnimatedView>
            
            <ScrollView contentContainerStyle={styles.content}>
                <Animatable.View ref={formRef} style={styles.form}>
                    <AnimatedView>
                        <Input label="Marca" placeholder="Ex: Volkswagen" value={marca} onChangeText={setMarca} containerStyle={{ width: '90%' }} />
                    </AnimatedView>
                    <AnimatedView>
                        <Input label="Modelo" placeholder="Ex: Gol" value={modelo} onChangeText={setModelo} containerStyle={{ width: '90%' }} />
                    </AnimatedView>
                    
                    <AnimatedView style={[styles.row, { width: '90%' }]}>
                        <View style={styles.rowItem}>
                            <Input 
                                label="Ano" 
                                placeholder="AAAA" 
                                value={ano} 
                                onChangeText={handleAnoChange}
                                keyboardType="number-pad"
                                maxLength={4} 
                            />
                        </View>
                        <View style={styles.rowItem}>
                            <Input label="Quilometragem" placeholder="Ex: 50000" value={quilometragem} onChangeText={setQuilometragem} keyboardType="number-pad" />
                        </View>
                    </AnimatedView>
                    
                    <AnimatedView>
                        <Input label="Tipo de Combustível" placeholder="Ex: Gasolina, Flex" value={tipoCombustivel} onChangeText={setTipoCombustivel} containerStyle={{ width: '90%' }} />
                    </AnimatedView>
                    <AnimatedView>
                        <Input label="Cor" placeholder="Ex: Preto" value={cor} onChangeText={setCor} containerStyle={{ width: '90%' }} />
                    </AnimatedView>

                    <AnimatedView>
                        <TouchableOpacity style={styles.optionalToggle} onPress={showOptional ? handleHideOptional : () => setShowOptional(true)} activeOpacity={0.7}>
                            <Feather name={showOptional ? "minus" : "plus"} size={20} color={Colors.secondary} />
                            <AppText style={styles.optionalText}>Dados opcionais</AppText>
                        </TouchableOpacity>
                    </AnimatedView>

                    {showOptional && (
                        <View style={styles.optionalContainer}>
                            <Animatable.View ref={optionalRef1} animation="fadeInDown" duration={400} style={[styles.row, { width: '90%' }]}>
                                <View style={styles.rowItem}>
                                    <Input label="Tração" placeholder="Ex: 4x4" value={tracao} onChangeText={setTracao} />
                                </View>
                                <View style={styles.rowItem}>
                                    <Input label="Versão" placeholder="Ex: 1.6 MSI" value={versao} onChangeText={setVersao} />
                                </View>
                            </Animatable.View>

                            <Animatable.View ref={optionalRef2} animation="fadeInDown" duration={400} style={[styles.row, { width: '90%' }]}>
                                <View style={styles.rowItem}>
                                    <Input 
                                        label="Troca de óleo" 
                                        placeholder="dd/mm/aaaa" 
                                        value={trocaOleo}
                                        type="date"
                                        onDateChange={({ date }) => setTrocaOleo(date)}
                                    />
                                </View>
                                <View style={styles.rowItem}>
                                    <Input
                                        label="Troca de pneu"
                                        placeholder="dd/mm/aaaa"
                                        value={trocaPneu}
                                        type="date"
                                        onDateChange={({ date }) => setTrocaPneu(date)}
                                    />
                                </View>
                            </Animatable.View>
                        </View>
                    )}
                </Animatable.View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Button title="Cadastrar Veículo" onPress={handleCadastro} containerStyle={{ width: '60%' }} />
            </View>
        </View>
    );
}

export default function CadastroVeiculo() {
    return (
        <AnimationProvider>
            <CadastroVeiculoContent />
        </AnimationProvider>
    );
}