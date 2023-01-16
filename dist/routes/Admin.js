"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/create-superadmin', adminController_1.CreateSuperadmin);
router.post('/create-admin/:_id', auth_1.auth, adminController_1.CreateAdmin);
router.post('/create-agent/:_id', auth_1.auth, adminController_1.CreateAgent);
router.get('/get-all-agents/', auth_1.auth, adminController_1.getAllAgents);
router.get('/get-single-agent/:_id', auth_1.auth, adminController_1.getSingleAgent);
exports.default = router;
