type User = {
    name?: string,
    surname?: string,
    nickname: string,
    email: string,
    organisation: string
    password: string
}

export default User

export interface UserResponse {
    name: string,
    surname: string,
    nickname: string,
    email: string,
    organisation: string
}