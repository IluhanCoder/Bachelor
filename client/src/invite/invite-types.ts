import { ProjectResponse } from "../project/project-types";
import { UserResponse } from "../user/user-types";

export interface InviteToUserResponse {
    _id: string,
    project: ProjectResponse,
    host: UserResponse
}