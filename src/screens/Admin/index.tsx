import { AppText, Button, Input } from "@/components";
import { strings } from "@/languages";
import { Colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import {
    Activity,
    BarChart,
    ChevronLeft,
    FileText,
    Grid,
    Minus,
    Plus,
    Users,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Estados para controlar a visibilidade de cada seção (Lógica showOptional)
  const [showDashboard, setShowDashboard] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReports, setShowReports] = useState(false);

  // Estados dos inputs (Mock)
  const [userSearch, setUserSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={[styles.headerIcon, { top: insets.top + 10 }]}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ChevronLeft size={30} color={Colors.primary} />
      </TouchableOpacity>
      <AppText style={[styles.headerTitle, { top: insets.top + 12 }]}>
        {strings.admin.title}
      </AppText>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingTop: insets.top + 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* SEÇÃO 1: DASHBOARD */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowDashboard(!showDashboard)}
            style={styles.optionalToggle}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BarChart color={Colors.primary} size={20} style={{ marginRight: 8 }} />
              <AppText style={styles.optionalText}>
                {strings.admin.dashboard.title}
              </AppText>
            </View>
            <View>
                {showDashboard ? <Minus color={Colors.gray} size={20} /> : <Plus color={Colors.primary} size={20} />}
            </View>
          </TouchableOpacity>

          {showDashboard && (
            <View style={styles.optionalContainer}>
              {/* Stats Cards */}
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <AppText style={styles.statNumber}>120</AppText>
                  <AppText style={styles.statLabel}>{strings.admin.dashboard.clients}</AppText>
                </View>
                <View style={styles.statCard}>
                  <AppText style={styles.statNumber}>45</AppText>
                  <AppText style={styles.statLabel}>{strings.admin.dashboard.servicesToday}</AppText>
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={[styles.statCard, { borderColor: Colors.error }]}>
                  <AppText style={[styles.statNumber, { color: Colors.error }]}>3</AppText>
                  <AppText style={styles.statLabel}>{strings.admin.dashboard.pending}</AppText>
                </View>
              </View>

              <View style={styles.divider} />
              
              {/* Recent Activity */}
              <AppText style={styles.subHeader}>{strings.admin.dashboard.recentActivity}</AppText>
              <View style={styles.activityItem}>
                <AppText style={styles.activityText}>Novo cadastro: João Silva</AppText>
                <AppText style={styles.activityTime}>14:00</AppText>
              </View>
              <View style={styles.activityItem}>
                <AppText style={styles.activityText}>Denúncia: Oficina X</AppText>
                <AppText style={styles.activityTime}>12:30</AppText>
              </View>
            </View>
          )}
        </View>

        {/* SEÇÃO 2: GERENCIAMENTO DE USUÁRIOS */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowUsers(!showUsers)}
            style={styles.optionalToggle}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Users color={Colors.primary} size={20} style={{ marginRight: 8 }} />
              <AppText style={styles.optionalText}>
                {strings.admin.users.title}
              </AppText>
            </View>
            <View>
                {showUsers ? <Minus color={Colors.gray} size={20} /> : <Plus color={Colors.primary} size={20} />}
            </View>
          </TouchableOpacity>

          {showUsers && (
            <View style={styles.optionalContainer}>
              <Input
                placeholder={strings.admin.users.searchPlaceholder}
                value={userSearch}
                onChangeText={setUserSearch}
                containerStyle={{ marginBottom: 10 }}
              />
              
              <View style={styles.filterRow}>
                <TouchableOpacity style={[styles.filterBadge, styles.filterBadgeActive]}>
                    <AppText style={styles.filterBadgeTextActive}>Todos</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBadge}>
                    <AppText style={styles.filterBadgeText}>Prestador</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterBadge}>
                    <AppText style={styles.filterBadgeText}>Cliente</AppText>
                </TouchableOpacity>
              </View>

              {/* Resultado Mockado */}
              <View style={styles.resultCard}>
                <View>
                    <AppText style={styles.resultName}>Oficina do Pedro</AppText>
                    <AppText style={styles.resultType}>Prestador • Ativo</AppText>
                    <AppText style={styles.resultId}>ID: #88291</AppText>
                </View>
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionButtonSmall}>
                        <AppText style={styles.actionButtonText}>Editar</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButtonSmall, { backgroundColor: '#ffebeb' }]}>
                        <AppText style={[styles.actionButtonText, { color: Colors.error }]}>Desativar</AppText>
                    </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* SEÇÃO 3: CATEGORIAS DE SERVIÇO */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowCategories(!showCategories)}
            style={styles.optionalToggle}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Grid color={Colors.primary} size={20} style={{ marginRight: 8 }} />
              <AppText style={styles.optionalText}>
                {strings.admin.categories.title}
              </AppText>
            </View>
            <View>
                {showCategories ? <Minus color={Colors.gray} size={20} /> : <Plus color={Colors.primary} size={20} />}
            </View>
          </TouchableOpacity>

          {showCategories && (
            <View style={styles.optionalContainer}>
              <View style={styles.categoryItem}>
                <AppText style={styles.categoryName}>Troca de Óleo</AppText>
                <TouchableOpacity>
                    <AppText style={{ color: Colors.error }}>Excluir</AppText>
                </TouchableOpacity>
              </View>
              <View style={styles.categoryItem}>
                <AppText style={styles.categoryName}>Manutenção de Pneus</AppText>
                <TouchableOpacity>
                    <AppText style={{ color: Colors.error }}>Excluir</AppText>
                </TouchableOpacity>
              </View>
              
              <Button title={strings.admin.categories.add} onPress={() => {}} containerStyle={{ marginTop: 10 }} />
            </View>
          )}
        </View>

        {/* SEÇÃO 4: HISTÓRICO GLOBAL */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowHistory(!showHistory)}
            style={styles.optionalToggle}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Activity color={Colors.primary} size={20} style={{ marginRight: 8 }} />
              <AppText style={styles.optionalText}>
                {strings.admin.history.title}
              </AppText>
            </View>
            <View>
                {showHistory ? <Minus color={Colors.gray} size={20} /> : <Plus color={Colors.primary} size={20} />}
            </View>
          </TouchableOpacity>

          {showHistory && (
            <View style={styles.optionalContainer}>
               <Input
                placeholder={strings.admin.history.searchPlaceholder}
                value={historySearch}
                onChangeText={setHistorySearch}
                containerStyle={{ marginBottom: 10 }}
              />
              <View style={styles.historyHeaderRow}>
                 <AppText style={styles.historyHeaderLabel}>Data</AppText>
                 <AppText style={styles.historyHeaderLabel}>Status</AppText>
              </View>

              <View style={styles.historyItem}>
                <View>
                    <AppText style={styles.historyId}>#SVC-9002</AppText>
                    <AppText style={styles.historySub}>Cli: Maria | Prest: AutoCenter</AppText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <AppText style={styles.historyDate}>22/11</AppText>
                    <AppText style={[styles.historyStatus, { color: Colors.success }]}>Concluído</AppText>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* SEÇÃO 5: RELATÓRIOS */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowReports(!showReports)}
            style={styles.optionalToggle}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FileText color={Colors.primary} size={20} style={{ marginRight: 8 }} />
              <AppText style={styles.optionalText}>
                {strings.admin.reports.title}
              </AppText>
            </View>
            <View>
                {showReports ? <Minus color={Colors.gray} size={20} /> : <Plus color={Colors.primary} size={20} />}
            </View>
          </TouchableOpacity>

          {showReports && (
            <View style={styles.optionalContainer}>
              <AppText style={styles.reportDescription}>
                {strings.admin.reports.description}
              </AppText>
              <Button 
                title={strings.admin.reports.exportPdf} 
                onPress={() => {}} 
                style={{ borderColor: Colors.primary }}
                textStyle={{ color: Colors.primary }}
              />
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}