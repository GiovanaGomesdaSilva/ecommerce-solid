import { ProductData } from "../domain/ProductFactory";

export interface IOrderRepository {
  findProduct(id: number): Promise<any>;
  create(customer: string, items: string, total: number, status: string): Promise<number>;
}