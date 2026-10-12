import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository'; 

export class PrismaOrderRepository implements IOrderRepository {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findProduct(id: number): Promise<any> {
    return this.prisma.product.findUnique({ where: { id: id } });
  }

  async create(customer: string, items: string, total: number, status: string): Promise<number> {
    const order = await this.prisma.order.create({
      data: {
        customer: customer,
        items: items,
        total: total,
        status: status,
      },
    });
    return order.id;
  }
}