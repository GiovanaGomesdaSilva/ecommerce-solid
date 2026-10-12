import { IPaymentMethod } from "./IPaymentMethod";
import logger from '../lib/logger';

export class CreditCardPayment implements IPaymentMethod{
    process(amount: number, details: any): void {
        logger.info(`Processando informações do cartão de crédito - R$ ${amount}`);

        if (details.cvv === '000'){
            throw new Error ('Cartão recusado!')
        }
    }
}