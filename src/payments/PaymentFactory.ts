import { IPaymentMethod } from './IPaymentMethod';
import { CreditCardPayment } from './CreditCardPayment';
import { DebitCardPayment} from './DebitCardPayment';
import { PixPayment} from './PixPayment';

export class PaymentFactory { 

    static createPayment(method: string): IPaymentMethod | null {

        if(method === 'credit_card'){
            return new CreditCardPayment();
        }
         if(method === 'debit_card'){
            return new DebitCardPayment();
        }
        if(method === 'pix'){
            return new PixPayment();
        }
        return null
    }
}
