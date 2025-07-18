/**
 * Node Modules
 */
import { JwtPayload } from 'jsonwebtoken';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import config from '../config';
import { User } from '../modules/user/user.model';
import { AppError } from '../errorHelpers/AppError';
import { generateJwtToken, verifyJwtToken } from './jwt';
import { IsActive, IUser } from '../modules/user/user.interface';

/**
 * Function for creating access and refresh token in the login
 */
export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };

    // generate access token
    const accessToken = generateJwtToken(
        jwtPayload,
        config.jwtAccessSecret,
        config.jwtAccessExpire
    );

    // generate refresh token
    const refreshToken = generateJwtToken(
        jwtPayload,
        config.jwtRefreshSecret,
        config.jwtRefreshExpire
    );

    return { accessToken, refreshToken };
};

/**
 * Function for generating new access token from refresh token
 */
export const createNewAccessTokenWithRefreshToken = async (
    refreshToken: string
) => {
    const verifiedRefreshToken = verifyJwtToken(
        refreshToken,
        config.jwtRefreshSecret
    ) as JwtPayload;

    const isUserExists = await User.findOne({
        email: verifiedRefreshToken.email,
    });

    if (!isUserExists) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'User does not exist');
    }

    if (
        isUserExists.isActive === IsActive.BLOCKED ||
        isUserExists.isActive === IsActive.INACTIVE
    ) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            `User is ${isUserExists.isActive}`
        );
    }

    if (isUserExists.isDeleted) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'User is deleted');
    }

    const jwtPayload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role,
    };

    const accessToken = generateJwtToken(
        jwtPayload,
        config.jwtAccessSecret,
        config.jwtAccessExpire
    );
    return accessToken;
};
