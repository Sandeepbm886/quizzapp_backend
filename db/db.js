import mongoose from "mongoose";

const connectDb = async () => {
    if (!process.env.MONGO_CONN_URL) {
        throw new Error("MONGO_CONN_URL is not configured");
    }

    try {
        await mongoose.connect(process.env.MONGO_CONN_URL);
        console.log("DB Connected");
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export default connectDb;
