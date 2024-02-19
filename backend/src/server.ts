import { createApp } from './app';
import { connectToDatabase, closeDatabaseConnection } from './connect';

const port = process.env.PORT || 3000;

(async () => {
    await connectToDatabase();
    const app = await createApp();
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
})();

process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    process.exit(0);
});
