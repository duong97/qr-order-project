export function formatThousand(value: number) {
    if (!value) {
        return 0;
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}