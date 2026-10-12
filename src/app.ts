import express from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
const orderRepository = new PrismaOrderRepository(prisma);
const notificationService = new NotificationService(new EtherealMailProvider());
const orderService = new OrderService(orderRepository, notificationService);
const orderController = new OrderController(orderService);

app.post('/orders', (req, res) => orderController.processOrder(req, res));

export default app;