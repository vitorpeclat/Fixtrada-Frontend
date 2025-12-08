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

export function unformatPhoneNumber(text: string): string {
    if (!text) return "";
    return text.replace(/\D/g, "");
}

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

export function unformatCEP(text: string): string {
    if (!text) return "";
    return text.replace(/\D/g, "");
}

export function formatDate(dateString: string): string {
    if (!dateString) return "-";
    
    try {
        // Trata formatos: YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss
        const date = new Date(dateString);
        
        // Verifica se a data é válida
        if (isNaN(date.getTime())) {
            return "-";
        }
        
        // Formata para DD/MM/YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (error) {
        return "-";
    }
}