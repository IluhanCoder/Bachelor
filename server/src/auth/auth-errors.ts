export default class AuthError extends Error {
    status: number

    constructor(message, status) {
        super(message);
        this.status = status ?? 500;
    }

    static UserExists() {
        return new AuthError("Користувач з таким Email або логіном вже існує", 400);
    }
    
    static UserNotFound() {
        return new AuthError("Користувача не було знайдено", 400);
    }

    static WrongPassword() {
        return new AuthError("Неправильний пароль", 400);
    }
}