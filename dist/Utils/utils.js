"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.agentSchema = exports.adminSchema = exports.updateSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.registerSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref('password')).required()
        .label('Confirm Password')
        .messages({ "any.only": "{{label}} does not match" }) //ref('password'),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
});
exports.updateSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    coverImage: joi_1.default.string()
});
exports.adminSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
});
exports.agentSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    companyName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
});
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        }
    }
};
const GenerateSalt = async () => {
    return await bcryptjs_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcryptjs_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const generateToken = async (_id) => {
    if (process.env.APP_SECRET) {
        return await jsonwebtoken_1.default.sign({ _id }, process.env.APP_SECRET, { expiresIn: '1d' });
    }
};
exports.generateToken = generateToken;
