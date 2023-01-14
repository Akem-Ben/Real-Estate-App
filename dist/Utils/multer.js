"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dirr9d0ox",
    api_key: 591515841429849,
    api_secret: "poaA3qnFSUxpsmxFmPwtclhaFfQ"
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary,
    params: async (res, file) => {
        return {
            folder: `ROYALSPRINGESTATE`
        };
    }
});
exports.upload = (0, multer_1.default)({ storage: storage });
