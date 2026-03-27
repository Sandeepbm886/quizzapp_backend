import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONN_URL)
        console.log("DB Connected");

    } catch (error) {
        console.error(error.message);

    }
}
export default connectDb;