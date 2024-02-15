import { Request } from "express"
import User from "../user/user-type"
import { IncomingHttpHeaders } from 'http'

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

interface CustomHeaders extends IncomingHttpHeaders {
    authorization?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: User,
    headers: CustomHeaders;
}