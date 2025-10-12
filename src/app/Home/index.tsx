import { Car } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, BottomMenu, Button } from '@/components'; // 1. Importe o BottomMenu
import { TabName } from '@/components/BottomMenu'; // Importe o tipo TabName
import { Colors } from '@/theme/colors';
import { styles } from './styles';
// Removi a importação de 'styles' para definir os novos estilos neste arquivo

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    
    // 2. Crie um estado para controlar a aba ativa
    const [activeTab, setActiveTab] = useState<TabName>('home');

    return (
        // 3. Use uma View como contêiner principal para a tela
        <View style={styles.pageContainer}>
            <ScrollView 
                style={[styles.scrollContainer, { paddingTop: insets.top + 10 }]}
                showsVerticalScrollIndicator={false}
                // O paddingBottom agora é aplicado no menu, não mais aqui
                contentContainerStyle={{ paddingBottom: 20 }} 
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
            <BottomMenu 
                activeTab={activeTab}
                onTabPress={setActiveTab}
            />
        </View>
    );
}

// 5. Defina os estilos para a nova estrutura