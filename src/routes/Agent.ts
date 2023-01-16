import express, {Request, Response} from 'express'
import { updateAgent } from '../controllers/agentController'
import {agentLogin} from '../controllers/agentController'
import { auth, agentAuth } from '../middleware/auth'
import { upload } from '../Utils/multer'

const router = express.Router()

router.patch('/update-agent/:_id', agentAuth, upload.single('coverImage'), updateAgent)
router.post('/login', agentLogin)

export default router