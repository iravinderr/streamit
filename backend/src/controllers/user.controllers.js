import jwt from "jsonwebtoken";
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

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return ErrorResponse(res, 400, "Fill all the details");
    }

    const user = await USER.findOne({ email });
    if (!user) {
        return ErrorResponse(res, 404, "User does not exists");
    }

    const passwordCorrect = await user.validatePassword(password);

    if (!passwordCorrect) {
        return ErrorResponse(res, 401, "Password is incorrect");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    user.password = undefined;
    user.refreshToken = undefined;
    user.avatar = undefined;
    user.coverImage = undefined;
    user.watchHistory = undefined;

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        succes: true,
        message: "Logged in",
        user,
        accessToken,
        refreshToken
    });
});

const logout = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await USER.findByIdAndUpdate(userId, {refreshToken : ""});

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        success: true,
        message: "Logged Out"
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return ErrorResponse(res, 401, "Unauthorised request");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const user = await USER.findById(decodedToken?._id);
    if (!user) {
        return ErrorResponse(res, 400, "Invalid token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        return ErrorResponse(res, 401, "Refresh access token is expired. Login again");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    const options = {
        httpOnly : true,
        secure : true
    };

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        succes: true,
        message: "Logged in",
        user,
        accessToken,
        refreshToken
    });
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return ErrorResponse(res, 400, "Password does not match");
    }

    const user = await USER.findById(req.user?._id);

    const passwordCorrect = await user.validatePassword(oldPassword);
    if (!passwordCorrect) {
        return ErrorResponse(res, 400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return SuccessResponse(res, "Password changed successfully");
});

const getUserDetails = asyncHandler(async (req, res) => {
    return SuccessResponse(res, "Succes", req.user);
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullName } = req.body;

    await USER.findByIdAndUpdate(req.user?._id, {fullName}, {new: true});

    return SuccessResponse(res, "Details updated succesfully");
});

const getChannelDetails = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        return ErrorResponse(res, 400, "Username is missing");
    }

    const channelDetails = await USER.aggregate([
        {
            $match: { username: username?.toLowerCase() }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        }
    ]);
});

export { register, login, logout, refreshAccessToken, changePassword, getUserDetails, updateUserDetails };