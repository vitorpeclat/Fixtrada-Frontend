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