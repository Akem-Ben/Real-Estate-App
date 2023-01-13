import express, {Request, Response} from 'express'
import {Register, Login, getAllUsers, deleteUser,
     getUser, updateUser} from '../controllers/userController'

const router = express.Router()

router.post('/signup', Register)
router.post('/login', Login)
router.get('/get-all-users', getAllUsers)
router.get('/get-user/:_id', getUser)
router.put('/update-user/:_id', updateUser)
router.delete('/delete-user/:_id', deleteUser)

export default router