import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/handler.utils.js";
import { ErrorResponse } from "../utils/response.utils.js";
import { USER } from "../models/user.models.js";


const verifyToken = asyncHandler(async (req, res, next) =>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return ErrorResponse(res, 401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await USER.findById(decodedToken?._id)
    if (!user) {
        return ErrorResponse(res, 400, "Session expired. Login again.")
    }

    req.user = user;
    next();
});


export { verifyToken };