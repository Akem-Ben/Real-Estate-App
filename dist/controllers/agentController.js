"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentLogin = exports.updateAgent = void 0;
const utils_1 = require("../Utils/utils");
const agentModel_1 = __importDefault(require("../model/agentModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updateAgent = async (req, res) => {
    try {
        const id = req.params._id;
        const { name, companyName, address, email, phone, serviceAvailable, coverImage } = req.body;
        const validateResult = utils_1.updateAgentSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const agent = await agentModel_1.default.findOne({ _id: id });
        if (!agent) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile"
            });
        }
        const updatedAgent = await agentModel_1.default.findOneAndUpdate({ _id: id }, { name, companyName, address, email, phone, serviceAvailable, coverImage: req.file.path }); //{new:true})
        if (updatedAgent) {
            const agent = await agentModel_1.default.findOne({ _id: id });
            return res.status(200).json({
                message: "Agent updated successfully",
                agent
            });
        }
        return res.status(400).json({
            message: "Agent Profile not updated"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/agent/update-agent`
        });
    }
};
exports.updateAgent = updateAgent;
const agentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateInput = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const agent = await agentModel_1.default.findOne({ email });
        console.log(agent);
        if (!agent) {
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            });
        }
        if (agent) {
            const validate = await bcryptjs_1.default.compare(password, agent.password);
            if (validate) {
                const token = await (0, utils_1.generateToken)(`${agent._id}`);
                res.cookie(`token`, token);
                return res.status(200).json({
                    message: "Login Successful",
                    role: agent.role,
                    email: agent.email
                });
            }
        }
        return res.status(400).json({
            message: "Invalid Credentials"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/agent/agentLogin"
        });
    }
};
exports.agentLogin = agentLogin;
