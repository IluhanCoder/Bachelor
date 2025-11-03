export default class AuthError extends Error {
    status: number

    constructor(message: string, status?: number) {
        super(message);
        this.status = status ?? 500;
    }

    static BadRequest(message: string) {
        return new AuthError(message, 400);
    }

    static UserExists() {
        return new AuthError("User with this email or username already exists", 400);
    }

    static Unauthorized() {
        return new AuthError("Unauthorized", 400);
    }
    
    static UserNotFound() {
        return new AuthError("User not found", 400);
    }

    static WrongPassword() {
        return new AuthError("Wrong password", 400);
    }

    static VerificationFailed() {
        return new AuthError("VerificationFailed", 400);
    }
}