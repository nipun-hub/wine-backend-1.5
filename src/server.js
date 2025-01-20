import dotenv from 'dotenv';
import dbConfig from './config/dbConfig.js';
import app from './app.js';
import seedInitialData from './seeder/seedingService.js';
// import seedInitialData from "./seeder/initial-data-seeder.js";

dotenv.config();

const PORT = 3000;

async function startServer() {
    try {
        await dbConfig();
        // await seedInitialData();
        // await seedInitialData();
        app.listen(PORT, () => {
            console.log(`Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer();