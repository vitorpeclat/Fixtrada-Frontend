import {
    AppText,
    Button
} from '@/components';
import { Colors } from '@/theme/colors';
import { Car } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from "./styles";

export default function PerfilScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView 
            style={[styles.container, { paddingTop: insets.top + 10 }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
        >

            {/* Cartão de Ação Principal */}
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


        </ScrollView>
    );
}