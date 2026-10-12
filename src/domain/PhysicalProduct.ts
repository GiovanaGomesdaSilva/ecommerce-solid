import { IProduct } from "./IProducts";

export class PhysicalProduct implements IProduct {

    constructor(
    public id: number,
    public name: string,
    public prince: number
    ){}
    calculateFreight(): number {
        return 10;
    }
}