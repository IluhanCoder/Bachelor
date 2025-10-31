import { ProjectDto, Rights } from "@shared/types";
import { Document, Types } from "mongoose";

// Participant entry in the mongoose document: contains an ObjectId reference and rights
export type Participant = {
	participant: Types.ObjectId | string;
	rights: Rights;
};

export type ProjectDocument = ProjectDto & {
	owner: Types.ObjectId | string;
	participants: Participant[];
} & Document;