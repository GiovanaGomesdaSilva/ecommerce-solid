import { IPaymentMethod } from "./IPaymentMethod";
import logger from '../lib/logger';

export class DebitCardPayment implements IPaymentMethod{
    process(amount: number, details: any): void {
        logger.info(`Processando informações do cartão de débito - R$ ${amount}`);
    }
}