import { Router } from "express";
import authController from "./auth/auth-controller";

const router = Router();

router.post("/registration", authController.registration);
router.post("/login", authController.login);
router.post("/verify", authController.verifyToken);

export default router;