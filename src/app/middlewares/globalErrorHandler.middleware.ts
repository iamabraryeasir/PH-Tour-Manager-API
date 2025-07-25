/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Node Modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Local Modules
 */
import config from '../config';
import { AppError } from '../errorHelpers/AppError';
import { IErrorSources } from '../interfaces/error.types';

/**
 * Error Handlers
 */
import { handleDuplicateError } from '../errorHelpers/handleDuplicateError';
import { handleCastError } from '../errorHelpers/handleCastError';
import { handleZodValidationError } from '../errorHelpers/handleZodValidationError';
import { handleMongooseValidationError } from '../errorHelpers/handleMongooseValidationError';
import { deleteImageFromCloudinary } from '../config/cloudinary.config';

/**
 * Middleware Logic
 */
export const globalErrorHandler = async (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.file) {
        await deleteImageFromCloudinary(req.file.path);
    }

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
        const imageUrls = (req.files as Express.Multer.File[]).map(
            (file) => file.path
        );

        await Promise.all(
            imageUrls.map((url) => deleteImageFromCloudinary(url))
        );
    }

    let statusCode = 500;
    let message = error?.message || 'Something went wrong';
    let errorSources: IErrorSources[] = [];

    if (error.code === 11000) {
        /**
         * user already exists error
         */
        const simplifiedError = handleDuplicateError(error);

        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } else if (error.name === 'CastError') {
        /**
         * Mongo type cast error
         */
        const simplifiedError = handleCastError(error);

        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    } else if (error.name === 'ZodError') {
        /**
         * Zod validation error
         */
        const simplifiedError = handleZodValidationError(error);

        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as IErrorSources[];
    } else if (error.name === 'ValidationError') {
        /**
         * Mongoose validation error
         */
        const simplifiedError = handleMongooseValidationError(error);

        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as IErrorSources[];
    } else if (error instanceof AppError) {
        /**
         * Our local custom error
         */
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof Error) {
        /**
         * Inbuilt node error
         */
        message = error.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: config.NODE_ENV === 'development' ? error : null,
        stack: config.NODE_ENV === 'development' ? error.stack : null,
    });
};
