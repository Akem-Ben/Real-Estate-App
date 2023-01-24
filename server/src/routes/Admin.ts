import express, {Request, Response} from 'express'
import {CreateSuperadmin, CreateAdmin, CreateAgent, getAllAgents, getSingleAgent, deleteAgent} from '../controllers/adminController'
import {agentLogin} from '../controllers/agentController'
import { auth } from '../middleware/auth'
import { upload } from '../Utils/multer'

const router = express.Router()

router.post('/create-superadmin', CreateSuperadmin)
router.post('/create-admin/:_id', auth, CreateAdmin)
router.post('/create-agent/', auth, CreateAgent)
router.get('/get-all-agents/', auth, getAllAgents)
router.get('/get-single-agent/:_id', auth, getSingleAgent)
router.delete('/delete-agent/:_id', auth, deleteAgent)

export default router