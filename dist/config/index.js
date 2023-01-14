"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_KEY = exports.APP_SECRET = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(`mongodb://localhost:27017/abn_estates`, () => {
            console.log(`MongoDB connected`);
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.connectDB = connectDB;
exports.APP_SECRET = process.env.APP_SECRET;
exports.API_KEY = process.env.API_KEY;
