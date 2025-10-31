import { UserDto } from "@shared/types"
import { Request } from "express"
import { IncomingHttpHeaders } from 'http';

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
    user?: UserDto,
    headers: CustomHeaders;
}

export type AuthenticatedRequestWithFile = AuthenticatedRequest & {
    file: any
};