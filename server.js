import dotenv from "dotenv";
import { server } from "./app/index.js";
import connectDb from "./db/db.js";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 5001;

await connectDb();

const httpServer = server.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
});

let isShuttingDown = false;

const shutdown = async (signal) => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    console.log(`Received ${signal}. Shutting down gracefully...`);

    httpServer.close(async (serverError) => {
        if (serverError) {
            console.error("HTTP server close failed", serverError);
            process.exit(1);
        }

        try {
            await mongoose.connection.close();
            console.log("MongoDB connection closed");
            process.exit(0);
        } catch (dbError) {
            console.error("MongoDB close failed", dbError);
            process.exit(1);
        }
    });

    setTimeout(() => {
        console.error("Force exiting after shutdown timeout");
        process.exit(1);
    }, 10000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
    console.error("Unhandled rejection", error);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught exception", error);
    shutdown("uncaughtException");
});
