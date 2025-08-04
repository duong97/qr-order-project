export default interface Product {
    id?: number,
    name: string,
    price: number,
    description: string,
    thumbnail: string,
    category?: number,
    categories?: number[],
    categoryName?: string,
    options: number[]
}