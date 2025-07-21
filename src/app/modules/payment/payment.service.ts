/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatusCodes from 'http-status-codes';
import { AppError } from '../../errorHelpers/AppError';
import { BOOKING_STATUS } from '../booking/booking.interface';
import { Booking } from '../booking/booking.model';
import { PAYMENT_STATUS } from './payment.interface';
import { Payment } from './payment.model';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';

const initPayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError(
            httpStatusCodes.NOT_FOUND,
            'Payment not found. You have not booked this tour.'
        );
    }

    const booking = await Booking.findById(payment.booking)
        .populate('user', 'name email phone address')
        .populate('tour', 'title costFrom')
        .populate('payment');

    const sslPayload: ISSLCommerz = {
        name: (booking?.user as any).name,
        email: (booking?.user as any).email,
        address: (booking?.user as any).address,
        phoneNumber: (booking?.user as any).phone,
        amount: payment.amount,
        transactionId: payment.transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    return {
        paymentUrl: sslPayment.GatewayPageURL,
    };
};

const successPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.PAID },
            {
                new: true,
                runValidators: true,
                session,
            }
        );

        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            {
                status: BOOKING_STATUS.COMPLETE,
            },
            {
                runValidators: true,
                session,
            }
        );
        await session.commitTransaction();
        session.endSession();
        return { success: true, message: 'Payment Completed Successfully' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const failPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.FAILED },
            {
                new: true,
                runValidators: true,
                session,
            }
        );

        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            {
                status: BOOKING_STATUS.FAILED,
            },
            {
                runValidators: true,
                session,
            }
        );

        await session.commitTransaction();
        session.endSession();
        return { success: false, message: 'Payment Failed' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const cancelPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.CANCELED },
            {
                new: true,
                runValidators: true,
                session,
            }
        );

        await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            {
                status: BOOKING_STATUS.CANCEL,
            },
            {
                runValidators: true,
                session,
            }
        );

        await session.commitTransaction();
        session.endSession();
        return { success: false, message: 'Payment Canceled' };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
};
