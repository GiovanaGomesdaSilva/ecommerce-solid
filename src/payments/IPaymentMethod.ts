// Contrato: toda forma de pagamento sabe processar um pagamento.
export interface IPaymentMethod {
  process(amount: number, details: any): void;
}