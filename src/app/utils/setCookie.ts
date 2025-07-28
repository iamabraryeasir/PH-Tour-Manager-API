/**
 * Node Modules
 */
import { Response } from 'express';

/**
 * Local Modules
 */
import config from '../config';

/**
 * Prop Interface
 */
export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

/**
 * setAuthCookie util logic
 */
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: config.NODE_ENV === 'production',
            secure: config.NODE_ENV === 'production',
            sameSite: 'none',
        });
    }

    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: config.NODE_ENV === 'production',
            secure: config.NODE_ENV === 'production',
            sameSite: 'none',
        });
    }
};
