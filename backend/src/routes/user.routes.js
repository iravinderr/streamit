import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { 
    changePassword,
    confirmRegistration,
    getUserDetails,
    login, 
    logout, 
    refreshAccessToken, 
    register, 
    updateUserDetails} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/user.middlewares.js";

const router = Router();


// ================================================== REGISTRATION ROUTES ==================================================

// SEND ACCOUNT REGISTRATION OTP
router.post("/register", upload.none(), register);

// CONFIRM THE ACCOUNT REGISTRATION
router.post("/confirm-registration", upload.none(), confirmRegistration);


// ================================================== LOGIN/LOGOUT ROUTES ==================================================

// ACCOUNT LOGIN
router.post("/login", upload.none(), login);

// ACCOUNT LOGOUT
router.post("/logout", verifyToken, upload.none(), logout);


// ================================================== WEB TOKEN ROUTES ==================================================

// REFRESH THE WEB/LOGIN TOKENS
router.post("/refresh-tokens", upload.none(), refreshAccessToken);


// ================================================== CHANGE/RESET PASSWORD ROUTES ==================================================

router.post("/change-password", verifyToken, upload.none(), changePassword);



router.get("/get-details", verifyToken, getUserDetails);

router.put("/update-details", verifyToken, upload.none(), updateUserDetails);

export default router;