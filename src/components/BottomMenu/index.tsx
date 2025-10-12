import { ClipboardClock, House, User, type LucideProps } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

import { IconSelect } from '@/components/IconSelect';
import { FilterStatus } from '@/types/FilterStatus';
import { styles } from './styles';

export type TabName = 'home' | 'servicos' | 'perfil';

interface BottomMenuProps {
    activeTab: TabName;
    onTabPress: (tab: TabName) => void;
}

const tabs: { name: TabName; IconComponent: React.ComponentType<LucideProps> }[] = [
    {
        name: 'home',
        IconComponent: House,
    },
    {
        name: 'servicos',
        IconComponent: ClipboardClock,
    },
    {
        name: 'perfil',
        IconComponent: User,
    },
];

export function BottomMenu({ activeTab, onTabPress }: BottomMenuProps) {
    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <Pressable
                    key={tab.name}
                    onPress={() => onTabPress(tab.name)}
                    style={styles.tabItem}
                >
                    <IconSelect
                        IconComponent={tab.IconComponent}
                        size={28}
                        status={
                            activeTab === tab.name
                                ? FilterStatus.SELECTED
                                : FilterStatus.UNSELECTED
                        }
                    />
                </Pressable>
            ))}
        </View>
    );
}