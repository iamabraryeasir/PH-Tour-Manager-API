import config from '../config';
import { generateJwtToken } from './jwt';
import { IUser } from '../modules/user/user.interface';

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
