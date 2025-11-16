// ============================================================================
// UTILITÁRIOS: Formatadores
// ============================================================================
// Funções para formatação e desformatação de dados

// ============================================================================
// TELEFONE
// ============================================================================
// Formata: "11987654321" => "(11) 98765-4321"
export function formatPhoneNumber(text: string): string {
    if (!text) return "";
    let userInput = text.replace(/\D/g, "");
    userInput = userInput.slice(0, 11);

    if (userInput.length > 7) {
        return `(${userInput.slice(0, 2)}) ${userInput.slice(2, 7)}-${userInput.slice(7, 11)}`;
    } else if (userInput.length > 2) {
        return `(${userInput.slice(0, 2)}) ${userInput.slice(2, 7)}`;
    } else if (userInput.length > 0) {
        return `(${userInput.slice(0, 2)}`;
    } else {
        return "";
    }
}

// Remove formatação do telefone
export function unformatPhoneNumber(text: string): string {
    if (!text) return "";
    return text.replace(/\D/g, "");
}

// ============================================================================
// CEP
// ============================================================================
// Formata: "01234567" => "01234-567"
export function formatCEP(text: string): string {
    if (!text) return "";
    let userInput = text.replace(/\D/g, "");
    userInput = userInput.slice(0, 8);

    if (userInput.length > 5) {
        return `${userInput.slice(0, 5)}-${userInput.slice(5, 8)}`;
    } else {
        return userInput;
    }
}

// Remove formatação do CEP
export function unformatCEP(text: string): string {
    if (!text) return "";
    return text.replace(/\D/g, "");
}

// ============================================================================
// DATA
// ============================================================================
// Formata data de ISO ou com hífens para DD/MM/YYYY
export function formatDate(dateStr?: string): string {
    if (!dateStr) return "-";
    if (dateStr.includes('/')) return dateStr; // Already formatted
    const [year, month, day] = dateStr.split("T")[0].split("-");
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
}

// ============================================================================
// STATUS
// ============================================================================
// Traduz status para português
export function translateStatus(status: string): string {
    switch (status?.toLowerCase()) {
        case "pendente": return "Pendente";
        case "aceito": return "Aceito";
        case "recusado": return "Recusado";
        case "em_andamento": return "Em Andamento";
        case "concluído": return "Concluído";
        case "cancelado": return "Cancelado";
        case "incompleto": return "Incompleto";
        case "finalizado": return "Finalizado";
        default: return status;
    }
}