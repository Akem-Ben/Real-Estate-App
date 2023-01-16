import express, {Request, Response} from 'express'
import {CreateSuperadmin, CreateAdmin, CreateAgent, getAllAgents, getSingleAgent} from '../controllers/adminController'
import {agentLogin} from '../controllers/agentController'
import { auth } from '../middleware/auth'
import { upload } from '../Utils/multer'

const router = express.Router()

router.post('/create-superadmin', CreateSuperadmin)
router.post('/create-admin/:_id', auth, CreateAdmin)
router.post('/create-agent/:_id', auth, CreateAgent)
router.get('/get-all-agents/', auth, getAllAgents)
router.get('/get-single-agent/:_id', auth, getSingleAgent)

export default router