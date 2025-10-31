export interface UserDto {
    _id?: string,
    name?: string,
    surname?: string,
    nickname: string,
    email: string,
    organisation: string,
    avatar: {
        data: any,
        contentType: string
    }
}

export type RegisterCredentials = Pick<UserDto, 'nickname' | 'email' | 'organisation' > & { password: string };
export type LoginCredentials = Pick<UserDto, 'nickname' | 'email'> & { password: string };