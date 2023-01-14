import express, {Request, Response} from 'express'
import {Register, Login, getAllUsers, deleteUser,
     getUser, updateUser} from '../controllers/userController'
import { auth } from '../middleware/auth'
import { upload } from '../Utils/multer'

const router = express.Router()

router.post('/signup', Register)
router.post('/login', Login)
router.get('/get-all-users', getAllUsers)
router.get('/get-user/:_id', getUser)
router.patch('/update-user/:_id', auth, upload.single('coverImage'), updateUser)
router.delete('/delete-user/:_id', deleteUser)

export default router