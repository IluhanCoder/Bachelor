type RegCredantials = {
    name: string,
    surname: string,
    nickname: string,
    email: string,
    organisation: string
    password: string,
    pswSubmit?: string
}

export type LoginCredentials = {
    nickname: string | undefined,
    email: string | undefined,
    password: string
}

export default RegCredantials