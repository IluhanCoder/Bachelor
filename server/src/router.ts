import { Router } from "express";
import authController from "./auth/auth-controller";

const router = Router();

router.post("/registration", authController.registration);
router.post("/login", authController.login);

export default router;