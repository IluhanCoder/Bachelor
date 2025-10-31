import { UserDto } from '@shared/types';
import { Document } from 'mongoose';

export type UserDocument = UserDto & {password: string} & Document;