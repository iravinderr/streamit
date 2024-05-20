import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { login, logout, refreshAccessToken, register } from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/user.middlewares.js";

const router = Router();


router.post("/register", upload.none(), register);

router.post("/login", upload.none(), login);

router.post("/logout", verifyToken, upload.none(), logout);

router.post("/refresh-tokens", upload.none(), refreshAccessToken);

export default router;