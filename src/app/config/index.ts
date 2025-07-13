import 'dotenv/config';

interface EnvConfig {
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
  ];

  requiredEnvVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });

  return {
    nodeEnv: process.env.NODE_ENV as 'development' | 'production',
    port: process.env.PORT as string,
    mongoUri: process.env.MONGO_URI as string,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
    jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE as string,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE as string,
    bcryptSaltRound: parseInt(process.env.BCRYPT_SALT_ROUND as string),
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL as string,
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD as string,
  };
};

const config: EnvConfig = loadConfigVariable();

export default config;
