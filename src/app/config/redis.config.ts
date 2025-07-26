import { createClient } from 'redis';
import config from '.';

export const redisClient = createClient({
    username: config.REDIS_USERNAME,
    password: config.REDIS_PASSWORD,
    socket: {
        host: config.REDIS_HOST,
        port: parseInt(config.REDIS_PORT),
    },
});

// eslint-disable-next-line no-console
redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const connectToRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        // eslint-disable-next-line no-console
        console.log('Connected to Redis.');
    }
};

/*
    await redisClient.set('foo', 'bar');
    const result = await redisClient.get('foo');

    console.log(result); // >>> bar
*/
