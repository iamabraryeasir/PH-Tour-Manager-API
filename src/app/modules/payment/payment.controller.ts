import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import config from '../../config';
import { PaymentService } from './payment.service';
import { sendResponse } from '../../utils/sendResponse';

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await PaymentService.initPayment(bookingId);

    sendResponse(res, {
        statusCode: httpStatusCodes.OK,
        message: 'Payment done successfully',
        data: result,
    });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await PaymentService.successPayment(
        query as Record<string, string>
    );

    if (result.success) {
        res.redirect(
            `${config.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
        );
    }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await PaymentService.failPayment(
        query as Record<string, string>
    );

    if (!result.success) {
        res.redirect(
            `${config.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
        );
    }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await PaymentService.cancelPayment(
        query as Record<string, string>
    );

    if (!result.success) {
        res.redirect(
            `${config.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
        );
    }
});

export const PaymentController = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};
