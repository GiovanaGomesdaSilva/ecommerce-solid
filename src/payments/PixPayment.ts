import { IPaymentMethod } from "./IPaymentMethod";
import logger from '../lib/logger';

export class PixPayment implements IPaymentMethod{
    process(amount: number, details: any): void {
        logger.info(`Processando informações do Pix - R$ ${amount}`);
    }
}