"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    name: String,
    desc: String,
    projectId: mongoose_1.default.Types.ObjectId,
    isChecked: Boolean,
    createdBy: mongoose_1.default.Types.ObjectId,
    created: Date,
    checkedDate: { type: Date, required: false },
    executors: [mongoose_1.default.Types.ObjectId],
    status: String,
    difficulty: String,
    priority: String,
    requirements: String,
});
const TaskModel = mongoose_1.default.model('Task', taskSchema);
exports.default = TaskModel;
