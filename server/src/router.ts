import { Router } from "express";
import authController from "./auth/auth-controller";

const router = Router();

router.post("/registration", authController.registration);

export default router;