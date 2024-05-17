import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// INITIALISING THE APP
const app = express();


// ADDING CORS MIDDLEWARE
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// ADDING MIDDLEWARE FOR JSON PARSING
app.use(express.json({limit: "16kb"}));

// ADDING MIDDLEWARE FOR URL PARSING
app.use(express.urlencoded({extended: true, limit: "16kb"}));

// ADDING MIDDLEWARE FOR STATIC FILES
app.use(express.static("public"));

// ADDING MIDDLEWARE FOR PARSING COOKIES
app.use(cookieParser());



export default app;