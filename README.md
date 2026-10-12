# E-commerce Refatorado com SOLID

## Refatoração

- O `OrderController` só cuida de HTTP, e a lógica do pedido fica no `OrderService`.
- Cada forma de pagamento tem uma classe própria, conseguimos add o Pix sem modificar as demais. 
- Cada produto cálcula o próprio frete.
- Cada interface com a sua função.
- O `OrderService` depende de interfaces, não do Prisma nem do Nodemailer.
