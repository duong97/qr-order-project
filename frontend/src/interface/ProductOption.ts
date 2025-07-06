import ProductOptionItem from '@/interface/ProductOptionItem';
export default interface ProductOption {
    id?: number,
    name: string,
    multiple: boolean|number,
    selected?: object|number|undefined|null|number[],
    items: ProductOptionItem[],
}