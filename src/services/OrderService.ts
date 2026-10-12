import { IOrderRepository } from '../repositories/IOrderRepository.ts';
import { NotificationService } from './NotificationService';
import { ProductFactory } from '../domain/ProductFactory';
import { PaymentFactory } from '../payments/PaymentFactory';

export class OrderService {
    orderRepository: IOrderRepository;
    notificationService: NotificationService;

    constructor(orderRepository: IOrderRepository, notificationService: NotificationService){
        this.notificationService = notificationService;
        this.orderRepository = orderRepository;
    }
    
    async createOrder(customer: string, items: any[], paymentMethod: string, paymentDetails: any) {
        if( !items || items.length === 0){
            throw new Error ('Carrinho vazio!');
        }

        let totalAmount = 0;
        let productsDetails = [];

        for (const item of items){
            const product = await this.orderRepository.findProduct(item.productId);
            if (!product){
                throw new Error (`Produto ${item.productId} não encontrado.`);
            }

             const domainProduct = ProductFactory.createProduct(product);
            totalAmount += domainProduct.price * item.quantity;
            totalAmount += domainProduct.calculateFreight();

            productsDetails.push({ ...product, quantity: item.quantity });
        }
        const payment = PaymentFactory.createPayment(paymentMethod);
        if (!payment) {
         throw new Error('Método de pagamento não suportado');
    }
     payment.process(totalAmount, paymentDetails);

        const orderId = await this.orderRepository.create(customer, JSON.stringify(productsDetails), totalAmount, 'confirmed');

        const emailLink = await this.notificationService.sendOrderConfirmation(customer, orderId, totalAmount, productsDetails);

    return { orderId: orderId, emailLink: emailLink };

}
}
