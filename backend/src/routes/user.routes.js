import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { register } from "../controllers/user.controllers.js";

const router = Router();


router.post("/register", upload.none(), register);






export default router;