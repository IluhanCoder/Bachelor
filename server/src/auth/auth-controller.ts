import { Request, Response } from "express";
import authService from "./auth-service";

export default new class AuthController {
    async registration(req: Request, res: Response) {
        const credentials = req.body;
        const user = await authService.registrate(credentials);
        return res.json({
            status: "success",
            user
        });
    }
}