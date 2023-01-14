import express, {Request, Response} from 'express'
import {CreateSuperadmin, CreateAdmin, CreateAgent} from '../controllers/adminController'
import { auth } from '../middleware/auth'
import { upload } from '../Utils/multer'

const router = express.Router()

router.post('/create-superadmin', CreateSuperadmin)
router.post('/create-admin/:_id', auth, CreateAdmin)
router.post('/create-agent', auth, CreateAgent)
// router.post('/login',)

export default router