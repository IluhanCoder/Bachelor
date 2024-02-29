type User = {
    _id: string,
    name?: string,
    surname?: string,
    nickname: string,
    email: string,
    organisation: string
    password: string
}

export default User

export interface UserResponse {
    _id: string,
    name: string,
    surname: string,
    nickname: string,
    email: string,
    organisation: string
}