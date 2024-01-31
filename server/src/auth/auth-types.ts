export type RegCredantials = {
    name: string,
    surname: string,
    nickname: string,
    email: string,
    organisation: string
    password: string
}

export type LoginCredentials = {
    nickname: string | undefined,
    email: string | undefined,
    password: string
}