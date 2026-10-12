import { IProduct } from "./IProducts";

export class DigitalProduct implements IProduct{
    constructor(
        public id: number,
        public name: string,
        public prince: number
    ){}
    calculateFreight(): number {
        return 0;
    }
}