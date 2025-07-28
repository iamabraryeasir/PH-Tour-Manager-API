/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatusCodes from 'http-status-codes';
import { AppError } from '../../errorHelpers/AppError';
import { BOOKING_STATUS } from '../booking/booking.interface';
import { Booking } from '../booking/booking.model';
import { PAYMENT_STATUS } from './payment.interface';
import { Payment } from './payment.model';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { generatePdfInvoice, IInvoiceData } from '../../utils/invoice';
import { ITour } from '../tour/tour.interface';
import { IUser } from '../user/user.interface';
import { sendEmail } from '../../utils/sendEmail';

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

        if (!updatedPayment) {
            throw new AppError(401, 'Payment not found');
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            updatedPayment?.booking,
            {
                status: BOOKING_STATUS.COMPLETE,
            },
            {
                new: true,
                runValidators: true,
                session,
            }
        )
            .populate('tour', 'title')
            .populate('user', 'name email');

        if (!updatedBooking) {
            throw new AppError(401, 'Booking not found');
        }

        const invoiceData: IInvoiceData = {
            bookingDate: updatedBooking?.createdAt as Date,
            guestCount: updatedBooking?.guestCount,
            totalAmount: updatedPayment?.amount,
            tourTitle: (updatedBooking?.tour as unknown as ITour).title,
            transactionId: updatedPayment?.transactionId,
            userName: (updatedBooking.user as unknown as IUser).name,
        };

        const pdfBuffer = await generatePdfInvoice(invoiceData);

        await sendEmail({
            to: (updatedBooking.user as unknown as IUser).email,
            subject: 'Your tour booking invoice',
            templateName: 'invoice',
            templateData: {
                paymentId: updatedPayment.transactionId,
                payedAmount: updatedPayment.amount,
                pdfLink: 'https://youtube.com',
            },
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        });

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

const getInvoiceDownloadUrl = async (paymentId: string) => {
    const payment = await Payment.findById(paymentId).select('invoiceUrl');

    if (!payment) {
        throw new AppError(401, 'Payment not found');
    }

    if (!payment.invoiceUrl) {
        throw new AppError(401, 'No invoice found');
    }

    return payment.invoiceUrl;
};

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceDownloadUrl,
};
