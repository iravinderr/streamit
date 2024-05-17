import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/database.config.js";
import app from "./app.js";


const PORT = process.env.PORT;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`SERVER IS LIVE AT PORT ${PORT}`);
    })
})