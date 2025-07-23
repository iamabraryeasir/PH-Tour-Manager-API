/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
import { BOOKING_STATUS, IBooking } from './booking.interface';
import { Booking } from './booking.model';
import { Payment } from '../payment/payment.model';
import { PAYMENT_STATUS } from '../payment/payment.interface';
import { Tour } from '../tour/tour.model';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { bookingSearchableFields } from '../division/division.constant';

/**
 * Service Logics
 */
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId();

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId);

        if (!user?.phone || !user.address) {
            throw new AppError(
                httpStatusCodes.BAD_REQUEST,
                'Please update your profile to book a tour'
            );
        }

        const tour = await Tour.findById(payload.tour).select('costFrom');

        if (!tour?.costFrom) {
            throw new AppError(
                httpStatusCodes.BAD_REQUEST,
                'Not tour cost found'
            );
        }

        const amount = tour.costFrom * (payload.guestCount as number);

        const booking = await Booking.create(
            [
                {
                    user: userId,
                    status: BOOKING_STATUS.PENDING,
                    ...payload,
                },
            ],
            { session }
        );

        const payment = await Payment.create(
            [
                {
                    booking: booking[0]._id,
                    status: PAYMENT_STATUS.UNPAID,
                    transactionId,
                    amount,
                },
            ],
            { session }
        );

        const updatedBooking = await Booking.findByIdAndUpdate(
            booking[0]._id,
            {
                payment: payment[0]._id,
            },
            {
                session,
                new: true,
                runValidators: true,
            }
        )
            .populate('user', 'name email phone address')
            .populate('tour', 'title costFrom')
            .populate('payment');

        const sslPayload: ISSLCommerz = {
            name: user.name,
            email: user.email,
            address: user.address,
            amount: payment[0].amount,
            phoneNumber: user.phone,
            transactionId,
        };

        const sslPayment = await SSLService.sslPaymentInit(sslPayload);

        await session.commitTransaction();
        session.endSession();

        return {
            booking: updatedBooking,
            paymentUrl: sslPayment.GatewayPageURL,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const getUserBookings = async (userId: string) => {
    const bookings = await Booking.find({ user: userId })
        .populate('user', 'name email phone address')
        .populate('tour', 'title costFrom')
        .populate('payment');
    return bookings;
};

const getBookingById = async (bookingId: string) => {
    const booking = await Booking.findById(bookingId)
        .populate('user', 'name email phone address')
        .populate('tour', 'title costFrom')
        .populate('payment');
    if (!booking) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Booking not found');
    }
    return booking;
};

const getAllBookings = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(
        Booking.find()
            .populate('user', 'name email phone address')
            .populate('tour', 'title costFrom')
            .populate('payment'),
        query
    );

    const bookingsData = queryBuilder
        .search(bookingSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        bookingsData.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
};

const updateBookingStatus = async (
    bookingId: string,
    status: BOOKING_STATUS
) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'Booking not found');
    }

    booking.status = status;
    await booking.save();

    return booking;
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    getAllBookings,
    updateBookingStatus,
};
