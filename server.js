import dotenv from "dotenv";
import { server } from "./app/index.js";
import connectDb from "./db/db.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

await connectDb();

server.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
});
