import 'dotenv/config';

interface EnvConfig {
    // system
    NODE_ENV: 'development' | 'production';
    PORT: string;
    MONGO_URI: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRE: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRE: string;
    BCRYPT_SALT_ROUND: number;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    EXPRESS_SESSION_SECRET: string;
    FRONTEND_URL: string;
    SSL: {
        SSL_STORE_ID: string;
        SSL_STORE_PASS: string;
        SSL_PAYMENT_API: string;
        SSL_VALIDATION_API: string;
        SSL_SUCCESS_FRONTEND_URL: string;
        SSL_FAIL_FRONTEND_URL: string;
        SSL_CANCEL_FRONTEND_URL: string;
        SSL_SUCCESS_BACKEND_URL: string;
        SSL_FAIL_BACKEND_URL: string;
        SSL_CANCEL_BACKEND_URL: string;
    };
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    };
    EMAIL_SENDER: {
        SMTP_HOST: string;
        SMTP_PORT: string;
        SMTP_USER: string;
        SMTP_PASS: string;
        SMTP_FROM: string;
    };
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
        'SSL_STORE_ID',
        'SSL_STORE_PASS',
        'SSL_PAYMENT_API',
        'SSL_VALIDATION_API',
        'SSL_SUCCESS_FRONTEND_URL',
        'SSL_FAIL_FRONTEND_URL',
        'SSL_CANCEL_FRONTEND_URL',
        'SSL_SUCCESS_BACKEND_URL',
        'SSL_FAIL_BACKEND_URL',
        'SSL_CANCEL_BACKEND_URL',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
        'SMTP_FROM',
    ];

    requiredEnvVariable.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`);
        }
    });

    return {
        // system
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        PORT: process.env.PORT as string,

        // database
        MONGO_URI: process.env.MONGO_URI as string,

        // json web token
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE as string,

        // bcrypt
        BCRYPT_SALT_ROUND: parseInt(process.env.BCRYPT_SALT_ROUND as string),

        // admin
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,

        // google
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,

        // express session secret
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,

        // frontend url
        FRONTEND_URL: process.env.FRONTEND_URL as string,

        // ssl commerz
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID as string,
            SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
            SSL_SUCCESS_FRONTEND_URL: process.env
                .SSL_SUCCESS_FRONTEND_URL as string,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
            SSL_CANCEL_FRONTEND_URL: process.env
                .SSL_CANCEL_FRONTEND_URL as string,
            SSL_SUCCESS_BACKEND_URL: process.env
                .SSL_SUCCESS_BACKEND_URL as string,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
            SSL_CANCEL_BACKEND_URL: process.env
                .SSL_CANCEL_BACKEND_URL as string,
        },

        // Cloudinary
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        },

        // mail sender
        EMAIL_SENDER: {
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_FROM: process.env.SMTP_FROM as string,
        },
    };
};

const config: EnvConfig = loadConfigVariable();

export default config;
