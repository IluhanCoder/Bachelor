import { TaskDto } from "@shared/types";
import { Document, Types } from "mongoose";

// Server-side Task document: replace string IDs from DTO with ObjectId references
export type TaskDocument = Omit<TaskDto, 'createdBy' | 'backlogId' | 'executors'> & {
	createdBy: Types.ObjectId;
	backlogId?: Types.ObjectId;
	executors: Types.ObjectId[];
} & Document;