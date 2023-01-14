import express, {Request, Response} from 'express'
import {CreateSuperadmin} from '../controllers/adminController'
import { auth } from '../middleware/auth'
import { upload } from '../Utils/multer'

const router = express.Router()

router.post('/create-superadmin', CreateSuperadmin)
// router.post('/login',)

export default router