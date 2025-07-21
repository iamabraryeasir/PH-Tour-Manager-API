/**
 * Node Modules
 */
import httpStatusCodes from 'http-status-codes';
import bcrypt from 'bcryptjs';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { IAuthProvider, IUser, Role } from './user.interface';
import { User } from './user.model';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { userSearchableFields } from './user.constant';

/**
 * Create new user service logics
 */
const createUser = async (payload: Partial<IUser>) => {
    // destructuring only the data that we need
    const { email, password, ...rest } = payload;

    // check if is user already registered
    const ifUserExists = await User.findOne({ email });
    if (ifUserExists) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'User already exists');
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(
        password as string,
        config.BCRYPT_SALT_ROUND
    );

    // creating the auth provider for email and pass
    const authProvider: IAuthProvider = {
        provider: 'credentials',
        providerId: email as string,
    };

    // saving the data to database
    const newUser = await User.create({
        email,
        auths: [authProvider],
        password: hashedPassword,
        ...rest,
    });

    return newUser;
};

/**
 * Get all user service logic
 */
const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query);
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta(),
    ]);

    return {
        data,
        meta,
    };
};

/**
 * Get Single User
 */
const getSingleUser = async (id: string) => {
    const user = await User.findById(id);
    return {
        data: user,
    };
};

/**
 * Update user service
 */
const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    // check if user exists with the userId
    const ifUserExists = await User.findById(userId);
    if (!ifUserExists) {
        throw new AppError(httpStatusCodes.NOT_FOUND, 'User not found');
    }

    // check for role changing
    if (payload.role) {
        if (
            decodedToken.role === Role.USER ||
            decodedToken.role === Role.GUIDE
        ) {
            throw new AppError(
                httpStatusCodes.FORBIDDEN,
                'You are not authorized'
            );
        }

        if (
            payload.role === Role.SUPER_ADMIN &&
            decodedToken.role === Role.ADMIN
        ) {
            throw new AppError(
                httpStatusCodes.FORBIDDEN,
                'You are not authorized'
            );
        }
    }

    // only admin update fields
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (
            decodedToken.role === Role.USER ||
            decodedToken.role === Role.GUIDE
        ) {
            throw new AppError(
                httpStatusCodes.FORBIDDEN,
                'You are not authorized'
            );
        }
    }

    // rehash password on updates
    if (payload.password) {
        payload.password = await bcrypt.hash(
            payload.password,
            config.BCRYPT_SALT_ROUND
        );
    }

    // final update operation in db
    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return newUpdatedUser?.toObject();
};

export const UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    getSingleUser,
};
