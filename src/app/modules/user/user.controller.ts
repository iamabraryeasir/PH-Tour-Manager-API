/**
 * Node Modules
 */
import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { UserServices } from './user.service';

/**
 * User Controllers
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserServices.createUser(req.body);

    res.status(httpStatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserServices.getAllUsers();

    res.status(httpStatusCodes.OK).json({
      success: true,
      message: 'Successfully fetched all users',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  getAllUsers,
};
