import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { 
    changePassword,
    getUserDetails,
    login, 
    logout, 
    refreshAccessToken, 
    register, 
    updateUserDetails} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/user.middlewares.js";

const router = Router();


router.post("/register", upload.none(), register);

router.post("/login", upload.none(), login);

router.post("/logout", verifyToken, upload.none(), logout);

router.post("/refresh-tokens", upload.none(), refreshAccessToken);

router.post("/change-password", verifyToken, upload.none(), changePassword);

router.get("/get-details", verifyToken, getUserDetails);

router.put("/update-details", verifyToken, upload.none(), updateUserDetails);

export default router;