import { Request, Response } from 'express';
//import { PrismaClient } from '@prisma/client';
//import { getMailClient } from '../lib/mail';
//import nodemailer from 'nodemailer';
import logger from '../lib/logger';
// adicionado O ProducFactory
//import { ProductFactory } from '../domain/ProductFactory';
// adicionando o PaymentFactory
//import { PaymentFactory } from '../payments/PaymentFactory';
//adicionando as notificações e o provider
//import { NotificationService } from '../services/NotificationService';
//import { EtherealMailProvider } from '../providers/EtherealMailProvider';
//import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { OrderService } from '../services/OrderService';

export class OrderController{
  orderService: OrderService;

  constructor (orderService: OrderService){
    this.orderService = orderService;
  }
    
async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      const result = await this.orderService.createOrder(customer, items, paymentMethod, paymentDetails);

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.orderId,
        emailPreview: result.emailLink,
      });
    } catch (error: any) {
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(400).json({ error: error.message });
    }
  }
}


