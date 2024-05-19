import { USER } from "../models/user.models.js";
import { asyncHandler } from "../utils/handler.utils.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.utils.js";


const register = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;

    const user = await USER.findOne({ username, email });
    if (user) {
        return ErrorResponse(res, 400, "User already exists");
    }

    await USER.create({ fullName, username, email, password });

    return SuccessResponse(res, "User registered successfully");
});


export { register };