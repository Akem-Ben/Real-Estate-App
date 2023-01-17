"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgent = exports.getSingleAgent = exports.getAllAgents = exports.CreateAgent = exports.CreateAdmin = exports.CreateSuperadmin = void 0;
const utils_1 = require("../Utils/utils");
const userModel_1 = __importDefault(require("../model/userModel"));
const agentModel_1 = __importDefault(require("../model/agentModel"));
const CreateSuperadmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        const validateInput = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const salt = await (0, utils_1.GenerateSalt)();
        const superAdminHashedPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const superAdmin = await userModel_1.default.findOne({ email });
        if (!superAdmin) {
            let allAdmin = await userModel_1.default.create({
                firstName,
                lastName,
                email,
                password: superAdminHashedPassword,
                phone,
                address: "",
                salt,
                gender: "",
                lng: 0,
                lat: 0,
                verified: true,
                role: "Super Admin",
                coverImage: ""
            });
            const superAdminExist = await userModel_1.default.findOne({ email });
            return res.status(201).json({
                message: 'Admin registered successfully',
                superAdminExist
            });
        }
        return res.status(400).json({
            message: "Admin already Exists",
            Error: "Admin already Exists"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server error",
            Error: "/admin/create-superadmin"
        });
    }
};
exports.CreateSuperadmin = CreateSuperadmin;
const CreateAdmin = async (req, res) => {
    try {
        const _id = req.params._id;
        const { firstName, lastName, email, password, phone } = req.body;
        const validateInput = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const salt = await (0, utils_1.GenerateSalt)();
        const superAdminHashedPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const admin = await userModel_1.default.findOne({ _id });
        if (admin?.email === email) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        if (admin?.phone === phone) {
            return res.status(400).json({
                message: "Phone number already exists"
            });
        }
        if (admin?.role === 'Super Admin') {
            let allUser = await userModel_1.default.create({
                firstName,
                lastName,
                email,
                password: superAdminHashedPassword,
                confirm_password: superAdminHashedPassword,
                phone,
                address: "",
                salt,
                gender: "",
                lng: 0,
                lat: 0,
                verified: true,
                role: "Admin",
                coverImage: ""
            });
            const superAdminExist = await userModel_1.default.findOne({ email });
            console.log(superAdminExist);
            return res.status(201).json({
                message: 'Admin created successfully',
                verified: superAdminExist?.verified,
                email: superAdminExist?.email,
                lastName: superAdminExist?.lastName
            });
        }
        return res.status(400).json({
            message: "Admin already Exists",
            Error: "Admin already Exists"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            Error: "/admin/create-admin"
        });
    }
};
exports.CreateAdmin = CreateAdmin;
const CreateAgent = async (req, res) => {
    try {
        const _id = req.user._id;
        const { name, companyName, email, password, phone } = req.body;
        const validateInput = utils_1.agentSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const salt = await (0, utils_1.GenerateSalt)();
        const agentPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const agent = await agentModel_1.default.findOne({ email });
        const Admin = await userModel_1.default.findOne({ _id });
        if (Admin?.role === "admin" || Admin?.role === "Super Admin") {
            if (!agent) {
                const createAgent = await agentModel_1.default.create({
                    name,
                    companyName,
                    pincode: "",
                    phone,
                    address: "",
                    email,
                    password: agentPassword,
                    salt,
                    serviceAvailable: false,
                    rating: 0,
                    role: "agent",
                    property: [],
                    coverImage: ""
                });
                return res.status(201).json({
                    message: "Agent created successfully",
                    createAgent
                });
            }
            return res.status(400).json({
                message: "Agent already exists"
            });
        }
        return res.status(400).json({
            message: "unauthorised access"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            Error: "/admin/create-agent"
        });
    }
};
exports.CreateAgent = CreateAgent;
const getAllAgents = async (req, res) => {
    try {
        // const _id = req.params._id
        // const Admin = await User.findOne({_id})
        // if(Admin?.role === "admin" || Admin?.role === "Super Admin"){
        const agents = await agentModel_1.default.find({});
        return res.status(200).json({
            message: "All Agents",
            agents
        });
        // }
        // return res.status(400).json({
        //     message: "unauthorised access"
        // })
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/admin/get-all-agents"
        });
    }
};
exports.getAllAgents = getAllAgents;
const getSingleAgent = async (req, res) => {
    try {
        const _id = req.params._id;
        console.log(_id);
        const agent = await agentModel_1.default.findOne({ _id: _id });
        if (agent) {
            return res.status(200).json({
                message: "Agent profile!!",
                agent
            });
        }
        return res.status(400).json({
            message: "agent not found"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/admin/get-single-agent`
        });
    }
};
exports.getSingleAgent = getSingleAgent;
const deleteAgent = async (req, res) => {
    try {
        const id = req.params._id;
        const agent = await agentModel_1.default.findByIdAndDelete({ _id: id });
        const agents = await agentModel_1.default.find({});
        if (agent) {
            return res.status(200).json({
                message: `Agent deleted`,
                agents
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: '/admin/delete-agent'
        });
    }
};
exports.deleteAgent = deleteAgent;
