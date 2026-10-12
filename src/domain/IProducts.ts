
export interface IProduct {
    id: number;
    name: string;
    prince: number;
    calculateFreight(): number;
}