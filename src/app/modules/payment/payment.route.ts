import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

router.get('/init-payment/:bookingId', PaymentController.initPayment);
router.post('/success', PaymentController.successPayment);
router.post('/fail', PaymentController.failPayment);
router.post('/cancel', PaymentController.cancelPayment);

export const PaymentRoutes = router;
