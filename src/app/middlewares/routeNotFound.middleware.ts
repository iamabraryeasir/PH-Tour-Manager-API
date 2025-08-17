import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

export const routeNotFound = (req: Request, res: Response) => {
    res.status(httpStatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Route Not Found',
        data: null,
    });
};
