export const formatTime = (date: string | Date) =>
    new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));

export const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);