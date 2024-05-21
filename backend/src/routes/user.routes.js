import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { 
    changePassword,
    getUser,
    login, 
    logout, 
    refreshAccessToken, 
    register, 
    updateUser} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/user.middlewares.js";

const router = Router();


router.post("/register", upload.none(), register);

router.post("/login", upload.none(), login);

router.post("/logout", verifyToken, upload.none(), logout);

router.post("/refresh-tokens", upload.none(), refreshAccessToken);

router.post("/change-password", verifyToken, upload.none(), changePassword);

router.get("/get-details", verifyToken, getUser);

router.put("/update-details", verifyToken, upload.none(), updateUser);

export default router;