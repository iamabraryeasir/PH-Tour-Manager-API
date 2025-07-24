/**
 * Node Modules
 */
import bcrypt from 'bcryptjs';
import httpStatusCodes from 'http-status-codes';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
import { createNewAccessTokenWithRefreshToken } from '../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { IAuthProvider } from '../user/user.interface';

/**
 * Credentials login service logic
 */
// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   // check if user exists
//   const ifUserExists = await User.findOne({ email });
//   if (!ifUserExists) {
//     throw new AppError(
//       httpStatusCodes.BAD_REQUEST,
//       'Invalid email or password'
//     );
//   }

//   // match the password
//   const isPasswordMatched = await bcrypt.compare(
//     password as string,
//     ifUserExists.password as string
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(
//       httpStatusCodes.BAD_REQUEST,
//       'Invalid email or password'
//     );
//   }

//   // generate tokens
//   const { accessToken, refreshToken } = createUserTokens(ifUserExists);

//   // remove sensitive data
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: ps, auths, ...rest } = ifUserExists.toObject();

//   return {
//     user: rest,
//     accessToken,
//     refreshToken,
//   };
// };

/**
 * Create new access token with refresh token service logic
 */
const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(
        refreshToken
    );

    return { accessToken: newAccessToken };
};

/**
 * Reset password service logic
 */
const resetPassword = async (
    decodedToken: JwtPayload,
    oldPassword: string,
    newPassword: string
) => {
    const userFromDB = await User.findById(decodedToken.userId);

    const verifyOldPassword = await bcrypt.compare(
        oldPassword,
        userFromDB?.password as string
    );

    if (!verifyOldPassword) {
        throw new AppError(
            httpStatusCodes.UNAUTHORIZED,
            "Previous password doesn't match"
        );
    }

    const newPasswordHash = await bcrypt.hash(
        newPassword,
        config.BCRYPT_SALT_ROUND
    );

    await User.findByIdAndUpdate(
        decodedToken.userId,
        { password: newPasswordHash },
        { new: true }
    );
};

/**
 * Reset password service logic
 */
const changePassword = async (
    decodedToken: JwtPayload,
    oldPassword: string,
    newPassword: string
) => {
    const userFromDB = await User.findById(decodedToken.userId);

    const verifyOldPassword = await bcrypt.compare(
        oldPassword,
        userFromDB?.password as string
    );

    if (!verifyOldPassword) {
        throw new AppError(
            httpStatusCodes.UNAUTHORIZED,
            "Previous password doesn't match"
        );
    }

    const newPasswordHash = await bcrypt.hash(
        newPassword,
        config.BCRYPT_SALT_ROUND
    );

    await User.findByIdAndUpdate(
        decodedToken.userId,
        { password: newPasswordHash },
        { new: true }
    );
};

/**
 * Reset password service logic
 */
const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(404, 'User not found');
    }

    if (
        user.password &&
        user.auths.some(
            (providerObject) => providerObject.provider === 'google'
        )
    ) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'You have already set your password.'
        );
    }

    const hashedPassword = await bcrypt.hash(
        plainPassword,
        config.BCRYPT_SALT_ROUND
    );

    const auths: IAuthProvider[] = [
        ...user.auths,
        { provider: 'credentials', providerId: user.email },
    ];

    user.password = hashedPassword;
    user.auths = auths;

    await user.save();
};

export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
};
