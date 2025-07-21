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
 * Get All Bookings
 */
const getAllBookings = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const bookings = await BookingService.getAllBookings();

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
        const bookings = await BookingService.getUserBookings();

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
        const booking = await BookingService.getBookingById();

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
