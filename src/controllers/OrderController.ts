import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
//import { getMailClient } from '../lib/mail';
//import nodemailer from 'nodemailer';
import logger from '../lib/logger';
// adicionado O ProducFactory
import { ProductFactory } from '../domain/ProductFactory';
// adicionando o PaymentFactory
import { PaymentFactory } from '../payments/PaymentFactory';
//adicionando as notificações e o provider
import { NotificationService } from '../services/NotificationService';
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';


const prisma = new PrismaClient();
const notificationService = new NotificationService(new EtherealMailProvider());
const orderRepository = new PrismaOrderRepository(prisma);
// Lembram do God Class q falamos em aula? Este é um exemplo
export class OrderController {
  
  // Método Gigante: Violação de SRP
  async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      // 1. VALIDAÇÃO (Deveria estar em outro lugar)
      if (!items || items.length === 0) {
        logger.error('Tentativa de pedido sem itens');
        return res.status(400).json({ error: 'Carrinho vazio' });
      }

      // 2. CÁLCULO DE PREÇO E ESTOQUE (Regra de Negócio Misturada) 
      let totalAmount = 0;
      let productsDetails = [];

      for (const item of items) {
        const product = await orderRepository.findProduct(item.productId);        
        if (!product) {
          return res.status(400).json({ error: `Produto ${item.productId} não encontrado` });
        }

        // Violação de LSP e OCP: 
        // Lógica condicional baseada em "tipo" (String). 
        // Se adicionarmos "Serviço" ou "Assinatura", teremos que mexer aqui.
        //if (product.type === 'physical') {
         // totalAmount += product.price * item.quantity;
          // Frete fixo simples
         // totalAmount += 10; 
        //} else if (product.type === 'digital') {
       //    totalAmount += product.price * item.quantity;
           // Produtos digitais não deveriam ter frete, ok.
           // Mas se o aluno tentar tratar 'item' genericamente depois, vai ter problemas.
        //}

        // Agora, cada produto calcula seu próprio frete sem o if de tipo
        const domainProduct = ProductFactory.createProduct(product);
        totalAmount += domainProduct.price * item.quantity;
        totalAmount += domainProduct.calculateFreight();

        productsDetails.push({ ...product, quantity: item.quantity });
      }

      // 3. PROCESSAMENTO DE PAGAMENTO (Violação de OCP)
      // Se quisermos adicionar "Pix", temos que modificar essa classe.
     /* if (paymentMethod === 'credit_card') {
        logger.info(`Processando cartão final ${paymentDetails.cardNumber.slice(-4)}`);
        // Simulação de gateway
        if (paymentDetails.cvv === '000') throw new Error('Cartão recusado');
      
      } else if (paymentMethod === 'debit_card') {
        logger.info('Processando débito...');
        // Lógica de débito
      } else {
        return res.status(400).json({ error: 'Método de pagamento não suportado' });
      }
    */
      const payment = PaymentFactory.createPayment(paymentMethod);
      if(!payment){
        return res.status(400).json({ error: 'Método de pagamento não suportado' });
      }
      payment.process(totalAmount, paymentDetails);

      /* 4. PERSISTÊNCIA (Violação de SRP - Controller acessando Banco) 
      const order = await prisma.order.create({
        data: {
          customer,
          items: JSON.stringify(productsDetails),
          total: totalAmount,
          status: 'confirmed'
        }
      });
      */
      const orderId = await orderRepository.create(customer, JSON.stringify(productsDetails), totalAmount, 'confirmed')

      // 5. NOTIFICAÇÃO (Violação de SRP - Efeitos colaterais no Controller) 
     /* const mailer = await getMailClient();

      const info = await mailer.sendMail({
        from: '"DevStore" <noreply@devstore.com>',
        to: customer, // O email do cliente vindo do body
        subject: `Confirmação do Pedido #${order.id}`,
        text: `Olá, seu pedido #${order.id} no valor de R$ ${totalAmount} foi confirmado.`,
        html: `
          <h1>Pedido Confirmado!</h1>
          <p>Olá, seu pedido <b>#${order.id}</b> foi processado com sucesso.</p>
          <p>Total: <strong>R$ ${totalAmount}</strong></p>
          <ul>
            ${productsDetails.map(p => `<li>${p.name}</li>`).join('')}
          </ul>
        `,
      });
      */
     

      const emailLink = await notificationService.sendOrderConfirmation(customer, orderId, totalAmount, productsDetails);
      // use este link para visualizar no Ethereal
     // logger.info(`Email enviado: ${nodemailer.getTestMessageUrl(info)}`); 



      return res.json({ 
        message: 'Pedido processado com sucesso', 
        orderId: orderId,
        //emailPreview: nodemailer.getTestMessageUrl(info) // Retorna o link na API para facilitar
        emailPreview: emailLink
      });

    } catch (error: any) {
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}