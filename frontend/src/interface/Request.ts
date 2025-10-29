import Table from "@/interface/Table";

export default interface Request {
    id?: number,
    tableId?: number,
    table?: Table,
    note?: string,
    createdAt?: string,
    statusLabel?: string,
    typeLabel?: string,
}