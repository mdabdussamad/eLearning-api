"use strict";
// import { Request, Response, NextFunction } from "express";
// import { CatchAsyncError } from "./catchAsyncErrors";
// import ErrorHandler from "../utils/ErrorHandler";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import  redis  from "../utils/redis";
// import { updateAccessToken } from "../controllers/user.controller";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../utils/redis"));
const user_controller_1 = require("../controllers/user.controller");
// Authenticated user — FINAL FIXED VERSION
exports.isAuthenticated = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler_1.default("Please login to access this resource", 401));
    }
    let decoded = null;
    try {
        // THIS IS THE CRITICAL FIX — use verify(), not decode()
        decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    }
    catch (error) {
        // Token expired or invalid → try refresh
        return (0, user_controller_1.updateAccessToken)(req, res, next);
    }
    if (!decoded || !decoded.id) {
        return next(new ErrorHandler_1.default("Invalid token", 401));
    }
    const user = await redis_1.default.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler_1.default("Please login again", 401));
    }
    req.user = JSON.parse(user);
    next();
});
// Authorize roles — PERFECT
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ErrorHandler_1.default(`Role (${req.user?.role || "unknown"}) is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
