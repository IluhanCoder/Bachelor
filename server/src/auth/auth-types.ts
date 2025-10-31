import { UserDto, RegisterCredentials as RegisterCredentialsShared, LoginCredentials as LoginCredentialsShared } from "@shared/types";
import { Request } from "express";
import { IncomingHttpHeaders } from 'http';

// Re-export shared credential types under the local names expected by server code
export type RegCredantials = RegisterCredentialsShared;
export type LoginCredentials = LoginCredentialsShared;

interface CustomHeaders extends IncomingHttpHeaders {
    authorization?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: UserDto;
    headers: CustomHeaders;
}

export type AuthenticatedRequestWithFile = AuthenticatedRequest & {
    file?: any;
};