import 'dotenv/config';

interface EnvConfig {
  nodeEnv: 'development' | 'production';
  port: string;
  mongoUri: string;
}

const loadConfigVariable = (): EnvConfig => {
  const requiredEnvVariable: string[] = ['NODE_ENV', 'PORT', 'MONGO_URI'];

  requiredEnvVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable ${key}`);
    }
  });

  return {
    nodeEnv: process.env.NODE_ENV as 'development' | 'production',
    port: process.env.PORT as string,
    mongoUri: process.env.MONGO_URI as string,
  };
};

const config: EnvConfig = loadConfigVariable();

export default config;
