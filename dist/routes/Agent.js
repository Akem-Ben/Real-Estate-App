"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const agentController_1 = require("../controllers/agentController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../Utils/multer");
const router = express_1.default.Router();
router.patch('/update-agent/:_id', auth_1.agentAuth, multer_1.upload.single('coverImage'), agentController_1.updateAgent);
router.post('/login', agentController_1.agentLogin);
router.post('/create-property', auth_1.agentAuth, multer_1.upload.single('image'), agentController_1.createProperty);
exports.default = router;
