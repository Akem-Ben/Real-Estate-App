"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSuperadmin = void 0;
const utils_1 = require("../Utils/utils");
const userModel_1 = __importDefault(require("../model/userModel"));
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
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            let allUser = await userModel_1.default.create({
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
