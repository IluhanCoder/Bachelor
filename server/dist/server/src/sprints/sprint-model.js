"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sprintSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    goal: {
        type: String,
        required: false
    },
    tasks: {
        type: [mongoose_1.default.Types.ObjectId],
        required: false,
        default: []
    }
});
exports.default = mongoose_1.default.model("Sprint", sprintSchema);
