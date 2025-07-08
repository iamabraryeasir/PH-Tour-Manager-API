/**
 * Node Modules
 */
import { Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { UserServices } from './user.service';

/**
 * User Controllers
 */
const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUser(req.body);

    res.status(httpStatusCodes.CREATED).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(httpStatusCodes.BAD_REQUEST).json({
      message: 'Something went wrong!!',
      error,
    });
  }
};

export const UserController = {
  createUser,
};
