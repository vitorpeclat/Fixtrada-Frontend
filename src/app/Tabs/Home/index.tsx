import { AnimatedView, AppText, Button } from '@/components';
import { Colors } from '@/theme/colors';
import { Car, History, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles'; // Importando os estilos que acabamos de criar

// Em uma aplicação real, você pegaria o nome do usuário de um contexto de autenticação, por exemplo.
const userName = "Ciclano";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView 
            style={[styles.container, { paddingTop: insets.top + 10 }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
        >
            {/* Cabeçalho de Boas-Vindas */}
            <AnimatedView style={styles.header}>
                <View style={styles.greetingContainer}>
                    <AppText style={styles.greetingText}>Olá,</AppText>
                    <AppText style={styles.userName}>{userName}!</AppText>
                </View>
                <TouchableOpacity onPress={() => console.log('Navegar para o perfil')}>
                    <User size={32} color={Colors.primary} />
                </TouchableOpacity>
            </AnimatedView>

            {/* Cartão de Ação Principal */}
            <AnimatedView delay={100} style={styles.mainCard}>
                <Car size={48} color={Colors.primary} style={styles.cardIcon} />
                <AppText style={styles.cardTitle}>
                    Seu veículo precisa de atenção?
                </AppText>
                <AppText style={styles.cardSubtitle}>
                    Agende um serviço de forma rápida e encontre os melhores profissionais perto de você.
                </AppText>
                <Button 
                    title="Agendar um Serviço"
                    onPress={() => console.log('Iniciar fluxo de agendamento')}
                    containerStyle={{ width: '100%' }}
                />
            </AnimatedView>

            {/* Acesso Rápido */}
            <AnimatedView delay={200}>
                <AppText style={styles.quickActionsTitle}>Acesso Rápido</AppText>
                <View style={styles.quickActionsContainer}>
                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                        <History size={24} color={Colors.primary} />
                        <AppText style={styles.actionButtonText}>Histórico</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                        <Car size={24} color={Colors.primary} />
                        <AppText style={styles.actionButtonText}>Meus Veículos</AppText>
                    </TouchableOpacity>
                </View>
            </AnimatedView>

        </ScrollView>
    );
}