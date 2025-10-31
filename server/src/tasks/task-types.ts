import { TaskDto } from "@shared/types";
import { Document, Types } from "mongoose";

// Server-side Task document: replace string IDs from DTO with ObjectId references
export type TaskDocument = Omit<TaskDto, 'createdBy' | 'projectId' | 'backlogId' | 'executors'> & {
	createdBy: Types.ObjectId;
	projectId?: Types.ObjectId;
	backlogId?: Types.ObjectId;
	executors: Types.ObjectId[];
} & Document;