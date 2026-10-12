import { IProduct } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';

export interface ProductData {
  id: number;
  name: string;
  type: string;
  price: number;
}

export class ProductFactory { 
    static createProduct (data: ProductData): IProduct {
        if(data.type === 'physical'){
            return new PhysicalProduct(data.id, data.name, data.price);
        }
         if(data.type === 'digital'){
            return new DigitalProduct(data.id, data.name, data.price);
        }
        throw new Error(`Tipo de produto não reconhecido: ${data.type}`);
    }
}
