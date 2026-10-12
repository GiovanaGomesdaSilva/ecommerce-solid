import { IProduct } from "./IProduct";

export class DigitalProduct implements IProduct{
    id: number;
    name: string;
    price: number;

    constructor( id: number, name:string, price: number){
        this.id = id;
        this.name = name;
        this.price = price;
    }
    
    calculateFreight(): number {
        return 0;
    }
}