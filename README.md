# E-commerce Refatorado com SOLID

## Como rodar

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

O servidor inicia em `http://localhost:3000`.

## Refatoração

- O `OrderController` só cuida de HTTP, e a lógica do pedido fica no `OrderService`.
- Cada forma de pagamento tem uma classe própria, conseguimos add o Pix sem modificar as demais. 
- Cada produto cálcula o próprio frete.
- Cada interface com a sua função.
- O `OrderService` depende de interfaces, não do Prisma nem do Nodemailer.
