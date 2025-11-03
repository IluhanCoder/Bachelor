"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_service_1 = __importDefault(require("./analytics-service"));
exports.default = new class AnalyticsController {
    async taskAmount(req, res) {
        try {
            const { projectId, startDate, endDate, isDaily, userId } = req.body;
            const result = await analytics_service_1.default.checkedTaskAmount(projectId, new Date(startDate), new Date(endDate), isDaily, userId);
            res.status(200).json({
                status: "success",
                result
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async taskRatio(req, res) {
        try {
            const { projectId, startDate, endDate, daily, userId } = req.body;
            const result = await analytics_service_1.default.taskRatio(projectId, new Date(startDate), new Date(endDate), daily, userId);
            res.status(200).json({
                status: "success",
                result
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async createdTaskAmount(req, res) {
        try {
            const { projectId, startDate, endDate, daily, userId } = req.body;
            const result = await analytics_service_1.default.createdTaskAmount(projectId, new Date(startDate), new Date(endDate), daily, userId);
            res.status(200).json({
                status: "success",
                result
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async predictRatio(req, res) {
        try {
            const { projectId, userId } = req.body;
            const result = await analytics_service_1.default.predictRatio(projectId, userId);
            res.status(200).json({
                status: "success",
                result
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async getQuickStats(req, res) {
        try {
            const { projectId, userId } = req.body;
            const result = await analytics_service_1.default.getQuickStats(projectId, userId);
            res.status(200).json({
                status: "success",
                result
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async getVelocityData(req, res) {
        try {
            const { projectId } = req.body;
            const result = await analytics_service_1.default.getVelocityData(projectId);
            res.status(200).json({
                status: "success",
                result
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async getTopContributors(req, res) {
        try {
            const { projectId } = req.body;
            const result = await analytics_service_1.default.getTopContributors(projectId);
            res.status(200).json({
                status: "success",
                result
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
};
