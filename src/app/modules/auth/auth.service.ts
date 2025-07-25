/**
 * Node Modules
 */
import bcrypt from 'bcryptjs';
import httpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Local Modules
 */
import { AppError } from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
import { createNewAccessTokenWithRefreshToken } from '../../utils/userTokens';
import config from '../../config';
import { IAuthProvider, IsActive } from '../user/user.interface';
import { sendEmail } from '../../utils/sendEmail';

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

/**
 * Forgot Password
 */
const forgotPassword = async (email: string) => {
    const isUserExists = await User.findOne({ email });

    if (!isUserExists) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'User does not exist');
    }

    if (
        isUserExists.isActive === IsActive.BLOCKED ||
        isUserExists.isActive === IsActive.INACTIVE
    ) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            `User is ${isUserExists.isActive}. Contact with the admins.`
        );
    }

    if (isUserExists.isDeleted) {
        throw new AppError(
            httpStatusCodes.BAD_REQUEST,
            'User is deleted. Contact the admins'
        );
    }

    if (!isUserExists.isVerified) {
        throw new AppError(httpStatusCodes.BAD_REQUEST, 'User is not verified');
    }

    const payload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role,
    };

    const resetPasswordToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
        expiresIn: '10m',
    });

    const resetUILink = `${config.FRONTEND_URL}/reset-password?id=${isUserExists._id}&token=${resetPasswordToken}`;

    sendEmail({
        to: isUserExists.email,
        subject: 'Password reset email.',
        templateName: 'forgotPassword',
        templateData: {
            name: isUserExists.name,
            resetUILink,
        },
    });
};

/**
 * Reset password service logic
 */
const resetPassword = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: Record<string, any>,
    decodedToken: JwtPayload
) => {
    if (payload.id !== decodedToken.userId) {
        throw new AppError(401, "You can't reset your password");
    }

    const isUserExists = await User.findById(decodedToken.userId);
    if (!isUserExists) {
        throw new AppError(404, 'No user found with this Id');
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        config.BCRYPT_SALT_ROUND
    );

    isUserExists.password = hashedPassword;
    await isUserExists.save();
};

export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    changePassword,
    setPassword,
    resetPassword,
    forgotPassword,
};
