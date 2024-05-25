import jwt from "jsonwebtoken";
import { USER } from "../models/user.models.js";
import { asyncHandler } from "../utils/handler.utils.js";
import { ErrorResponse, SuccessResponse } from "../utils/response.utils.js";
import { OTP } from "../models/otp.models.js";


// ================================================== REGISTRATION CONTROLLERS ==================================================

const register = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return ErrorResponse(res, 400, "Fill all the required fields")
    }

    const user = await USER.findOne({ email });
    if (user) {
        return ErrorResponse(res, 400, "Account already exists");
    }

    await OTP.create({ email });

    return SuccessResponse(res, "A verification otp has been sent to your email");
});

const confirmRegistration = asyncHandler(async (req, res) => {
    const { fullName, email, password, otp } = req.body;

    const recentOTP = await OTP.findOne({ email }).sort({ createdAt : -1 }).limit(1);
    if (!recentOTP) {
        return ErrorResponse(res, 404, "OTP expired. Try Again.");
    } else if (otp !== recentOTP) {
        return ErrorResponse(res, 401, "Enterd otp is incorrect");
    }

    await USER.create({ fullName, email, password, verified: true, details: details._id });

    return SuccessResponse(res, "Account created successfully");
});


// ================================================== LOGIN/LOGOUT CONTROLLERS ==================================================

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


// ================================================== TOKEN CONTROLLERS ==================================================

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


// ================================================== CHANGE/RESET PASSWORD CONTROLLERS ==================================================

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

const sendResetPasswordOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return ErrorResponse(res, 400, "Enter the email");
    }

    const user = await USER.findOne({ email });
    if (!user) {
        return ErrorResponse(res, 400, "Account does not exists");
    }

    await OTP.create({ email });

    return SuccessResponse(res, "A verification otp has been sent to your email");
});

const validateResetPasswordOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const recentOTP = await OTP.findOne({ email }).sort({ createdAt : -1 }).limit(1);

    if (!recentOTP) {
        return ErrorResponse(res, 400, "OTP expired. Try again.");
    } else if (otp !== recentOTP.otp) {
        return ErrorResponse(res, 400, "Entered otp is wrong"); 
    }

    return SuccessResponse(res, "Success");
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return ErrorResponse(res, 400, "Password does not match");
    }

    const user = await USER.findOneAndUpdate({ email }, { password : newPassword});

    return SuccessResponse(res, "Password reset successfully");
});


// ================================================== USER DETAILS CONTROLLERS ==================================================

const getUserDetails = asyncHandler(async (req, res) => {
    return SuccessResponse(res, "Succes", req.user);
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullName } = req.body;

    await USER.findByIdAndUpdate(req.user?._id, {fullName}, {new: true});

    return SuccessResponse(res, "Details updated succesfully");
});


// ================================================== CHANNEL CONTROLLERS ==================================================

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



export { 
    register,
    confirmRegistration,
    login,
    logout,
    refreshAccessToken,
    changePassword,
    sendResetPasswordOTP,
    validateResetPasswordOTP,
    resetPassword,
    getUserDetails,
    updateUserDetails
};