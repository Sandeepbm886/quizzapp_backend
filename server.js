import { app } from "./app/index.js";
import connectDb from "./db/db.js";
const PORT = process.env.PORT || 5001

await connectDb()

app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
})