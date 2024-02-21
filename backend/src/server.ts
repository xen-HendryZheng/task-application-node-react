import { ClickHouseClient } from '@clickhouse/client';
import { createApp } from './app';
import { connectToDatabase, closeDatabaseConnection, connectToClickHouse, closeClickHouseConnection } from './connect';

const port = process.env.PORT || 3000;
let clickhouseClient: ClickHouseClient | undefined = undefined;

(async () => {
    await connectToDatabase();
    clickhouseClient = await connectToClickHouse();
    const app = await createApp(clickhouseClient);
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})();

process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    await closeClickHouseConnection(clickhouseClient);
    process.exit(0);
});
