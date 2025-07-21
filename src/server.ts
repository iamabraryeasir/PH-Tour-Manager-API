/* eslint-disable no-console */
/**
 * Node Modules
 */
import { Server } from 'node:http';
import mongoose from 'mongoose';

/**
 * Local Modules
 */
import app from './app';
import config from './app/config';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;

/**
 * Main Server Start Function
 */
async function startServer() {
    try {
        await mongoose.connect(config.MONGO_URI);

        console.log('Successfully connected to DB');

        server = app.listen(config.PORT, () => {
            console.log(`Server is listening at port ${config.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * Running Server
 */
(async () => {
    await startServer();
    await seedSuperAdmin();
})();

/**
 * Server Safe Shutdown
 */
function shutdownServer(signalMessage: string, error: null | unknown = null) {
    console.log(`${signalMessage} Detected...`);
    console.log('Server shutting down...');

    if (error) {
        console.log(error);
    }

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
}

/**
 * Unhandled Rejection Error Handler
 */
process.on('unhandledRejection', (error) => {
    shutdownServer('Unhandled Rejection', error);
});

/**
 * Uncaught Rejection Error Handler
 */
process.on('uncaughtException', (error) => {
    shutdownServer('Uncaught Exception', error);
});

/**
 * Signal Termination / SigTerm Error Handler
 */
process.on('SIGTERM', () => {
    shutdownServer('SIGINT Signal');
});

process.on('SIGINT', () => {
    shutdownServer('SIGINT Signal');
});
