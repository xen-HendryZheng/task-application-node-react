import { ClickHouseClient, createClient } from '@clickhouse/client' // or '@clickhouse/client-web'
import { HealthcheckController } from './controllers/healthcheck.controller';
import { AppDataSource } from './data-source';
import { CLICKHOUSE_DATABASE, CLICKHOUSE_HOST, CLICKHOUSE_PASSWORD, CLICKHOUSE_USER } from './config';

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

export const connectToClickHouse = async (): Promise<ClickHouseClient> => {
    try {
        console.log(`Connecting to ClickHouse... ${CLICKHOUSE_HOST} ${CLICKHOUSE_USER} ${CLICKHOUSE_PASSWORD} ${CLICKHOUSE_DATABASE}`)
        const clickhouseClient = createClient({
            host: CLICKHOUSE_HOST,
            username: CLICKHOUSE_USER,
            password: CLICKHOUSE_PASSWORD,
            database: CLICKHOUSE_DATABASE
        });
        const pingResult = await clickhouseClient.ping();
        console.log(pingResult);
        pingResult.success ? console.log('ClickHouse connection established') : console.error('ClickHouse connection failed');
        return clickhouseClient;
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export const closeClickHouseConnection = async (clickhouseClient: ClickHouseClient): Promise<void> => {
    try {
        if (clickhouseClient) {
            await clickhouseClient.close();
            console.log('ClickHouse connection closed');
        }
    } catch (error) {
        console.error('Error closing ClickHouse connection:', error);
        process.exit(1);
    }
}