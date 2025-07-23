/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Node Modules
 */
import { JwtPayload } from 'jsonwebtoken';
import httpStatusCodes from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

/**
 * Local Modules
 */
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { BookingService } from './booking.service';
import { AppError } from '../../errorHelpers/AppError';

/**
 * Create Booking
 */
const createBooking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload;
        const payload = req.body;

        const booking = await BookingService.createBooking(
            payload,
            decodedToken.userId
        );

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'New booking added successfully',
            data: booking,
        });
    }
);

/**
 * Get all bookings
 */
const getAllBookings = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        /*
         * Query parameters can include:
         * - search: for searching by status, user, tour, or payment
         * - filter: for filtering results
         * - sort: for sorting results
         * - fields: for selecting specific fields
         * - page and limit: for pagination
         */

        const query = req.query;
        const bookings = await BookingService.getAllBookings(
            query as Record<string, string>
        );

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'Fetched all bookings successfully',
            data: bookings,
        });
    }
);

/**
 * Get all bookings of a user
 */
const getUserBookings = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload;
        const userId = decodedToken.userId;
        const bookings = await BookingService.getUserBookings(userId);

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'User bookings fetched successfully',
            data: bookings,
        });
    }
);

/**
 * Get single booking
 */
const getSingleBooking = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const bookingId = req.params.id;
        if (!bookingId) {
            throw new AppError(
                httpStatusCodes.BAD_REQUEST,
                'Booking ID is required'
            );
        }
        const booking = await BookingService.getBookingById(bookingId);

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'Fetched booking successfully',
            data: booking,
        });
    }
);

/**
 * Get single booking
 */
const updateBookingStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const booking = await BookingService.updateBookingStatus();

        sendResponse(res, {
            statusCode: httpStatusCodes.OK,
            message: 'Updated booking status successfully',
            data: booking,
        });
    }
);

export const BookingController = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getSingleBooking,
    updateBookingStatus,
};
