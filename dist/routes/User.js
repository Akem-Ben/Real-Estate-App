"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../Utils/multer");
const router = express_1.default.Router();
router.post('/signup', userController_1.Register);
router.post('/login', userController_1.Login);
router.get('/get-all-users', userController_1.getAllUsers);
router.get('/get-user/:_id', userController_1.getUser);
router.patch('/update-user/:_id', auth_1.auth, multer_1.upload.single('coverImage'), userController_1.updateUser);
router.delete('/delete-user/:_id', userController_1.deleteUser);
exports.default = router;
