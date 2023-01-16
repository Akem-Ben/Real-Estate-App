"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentAuth = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const agentModel_1 = __importDefault(require("../model/agentModel"));
const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: 'Kindly login'
            });
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, "akemini12345");
        if (!verified) {
            return res.status(401).json({
                Error: "Unauthorised"
            });
        }
        const { _id } = verified;
        const user = await userModel_1.default.findOne({ _id: _id });
        if (!user) {
            return res.status(401).json({
                Error: 'Invalid Credentials'
            });
        }
        req.user = verified;
        next();
    }
    catch (err) {
        return res.status(401).json({
            Error: "Unauthorised Access"
        });
    }
};
exports.auth = auth;
const agentAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: 'Kindly login'
            });
        }
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, "akemini12345");
        if (!verified) {
            return res.status(401).json({
                Error: "Unauthorised"
            });
        }
        const { _id } = verified;
        const agent = await agentModel_1.default.findOne({ _id: _id });
        if (!agent) {
            return res.status(401).json({
                Error: 'Invalid Credentials'
            });
        }
        req.agent = verified;
        next();
    }
    catch (err) {
        return res.status(401).json({
            Error: "Unauthorised Access"
        });
    }
};
exports.agentAuth = agentAuth;
