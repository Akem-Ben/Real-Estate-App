"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = exports.Login = exports.Register = void 0;
const utils_1 = require("../Utils/utils");
const userModel_1 = __importDefault(require("../model/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//=====REGISTER======//
const Register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirm_password, phone } = req.body;
        const validateInput = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const salt = await (0, utils_1.GenerateSalt)();
        const hashedPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            let allUser = await userModel_1.default.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                confirm_password: hashedPassword,
                phone,
                address: "",
                salt,
                gender: "",
                lng: 0,
                lat: 0,
                verified: false,
                role: "user"
            });
            const userExist = await userModel_1.default.findOne({ email });
            return res.status(201).json({
                message: 'User registered successfully',
                userExist
            });
        }
        return res.status(400).json({
            message: "User already Exists",
            Error: "User already Exists"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/singup"
        });
    }
};
exports.Register = Register;
//=============LOGIN==============//
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateInput = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            });
        }
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            });
        }
        if (user) {
            const validate = await bcryptjs_1.default.compare(password, user.password);
            if (validate) {
                const token = await (0, utils_1.generateToken)(`${user._id}`);
                res.cookie(`token`, token);
                return res.status(200).json({
                    message: "Login Successful",
                    role: user.role,
                    email: user.email,
                    verified: user.verified
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
            Error: "/users/login"
        });
    }
};
exports.Login = Login;
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.find({});
        return res.status(200).json({
            message: "All Users",
            users
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/get-all-users"
        });
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    try {
        const id = req.params._id;
        const user = await userModel_1.default.findOne({ _id: id });
        if (user) {
            return res.status(200).json({
                message: "Your profile nigga!!",
                user
            });
        }
        return res.status(400).json({
            message: "user not found"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/getUser`
        });
    }
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    try {
        const id = req.params._id;
        const { firstName, lastName, address, gender, phone } = req.body;
        const validateResult = utils_1.updateSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const user = await userModel_1.default.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile"
            });
        }
        const updatedUser = await userModel_1.default.findOneAndUpdate({ _id: id }, { firstName, lastName, address, gender, phone }, { new: true });
        if (updatedUser) {
            const userNew = await userModel_1.default.findOne({ _id: id });
            return res.status(200).json({
                message: "Profile updated successfully",
                userNew
            });
        }
        return res.status(400).json({
            message: "Profile not updated"
        });
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/update-user`
        });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const id = req.params._id;
        const user = await userModel_1.default.findByIdAndDelete({ _id: id });
        const users = await userModel_1.default.find({});
        if (user) {
            return res.status(200).json({
                message: `User deleted`,
                users
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: '/users/delete-user'
        });
    }
};
exports.deleteUser = deleteUser;
