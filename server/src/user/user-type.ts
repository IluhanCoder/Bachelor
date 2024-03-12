type User = {
    _id?: string,
    name?: string,
    surname?: string,
    nickname: string,
    email: string,
    organisation: string
    password: string,
    avatar: {
        data: Buffer,
        contentType: string
    }
}

export default User

export interface UserResponse {
    _id: string,
    name: string,
    surname: string,
    nickname: string,
    email: string,
    organisation: string,
    avatar: {
        data: Buffer,
        contentType: string
    }
}