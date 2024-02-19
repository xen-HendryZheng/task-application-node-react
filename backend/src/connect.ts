import { HealthcheckController } from './controllers/healthcheck.controller';
import { AppDataSource } from './data-source';

export const connectToDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.initialize()
            .then(() => {
                console.log("Data Source has been initialized!");
                HealthcheckController.databaseStatus = true;
            })
            .catch((err) => {
                console.error("Error during Data Source initialization", err)
            })
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export const closeDatabaseConnection = async (): Promise<void> => {
    try {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('Database connection closed');
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
        process.exit(1);
    }
};
