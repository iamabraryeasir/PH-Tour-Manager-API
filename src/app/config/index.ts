import 'dotenv/config';

interface EnvConfig {
    // system
    nodeEnv: 'development' | 'production';
    port: string;
    mongoUri: string;
    jwtAccessSecret: string;
    jwtAccessExpire: string;
    jwtRefreshSecret: string;
    jwtRefreshExpire: string;
    bcryptSaltRound: number;
    superAdminEmail: string;
    superAdminPassword: string;
    googleClientId: string;
    googleClientSecret: string;
    googleCallbackUrl: string;
    expressSessionSecret: string;
    frontendUrl: string;
}

const loadConfigVariable = (): EnvConfig => {
    const requiredEnvVariable: string[] = [
        'NODE_ENV',
        'PORT',
        'MONGO_URI',
        'JWT_ACCESS_SECRET',
        'JWT_ACCESS_EXPIRE',
        'JWT_REFRESH_SECRET',
        'JWT_REFRESH_EXPIRE',
        'BCRYPT_SALT_ROUND',
        'SUPER_ADMIN_EMAIL',
        'SUPER_ADMIN_PASSWORD',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_CALLBACK_URL',
        'EXPRESS_SESSION_SECRET',
        'FRONTEND_URL',
    ];

    requiredEnvVariable.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`);
        }
    });

    return {
        // system
        nodeEnv: process.env.NODE_ENV as 'development' | 'production',
        port: process.env.PORT as string,

        // database
        mongoUri: process.env.MONGO_URI as string,

        // json web token
        jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
        jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE as string,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
        jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE as string,

        // bcrypt
        bcryptSaltRound: parseInt(process.env.BCRYPT_SALT_ROUND as string),

        // admin
        superAdminEmail: process.env.SUPER_ADMIN_EMAIL as string,
        superAdminPassword: process.env.SUPER_ADMIN_PASSWORD as string,

        // google
        googleClientId: process.env.GOOGLE_CLIENT_ID as string,
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL as string,

        // express session secret
        expressSessionSecret: process.env.EXPRESS_SESSION_SECRET as string,

        // frontend url
        frontendUrl: process.env.FRONTEND_URL as string,
    };
};

const config: EnvConfig = loadConfigVariable();

export default config;
