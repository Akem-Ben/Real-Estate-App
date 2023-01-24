import express, {Request, Response} from 'express'
import { updateAgent, agentLogin, createProperty, getAllAgentProperty, 
    getSingleProperty, propertyUpdate, deleteProperty } from '../controllers/agentController'
import { auth, agentAuth } from '../middleware/auth'
import { upload } from '../Utils/multer'

const router = express.Router()

router.patch('/update-agent/:_id', agentAuth, upload.single('coverImage'), updateAgent)
router.post('/login', agentLogin)
router.post('/create-property', agentAuth, upload.single('image'), createProperty)
router.get('/get-properties', agentAuth, getAllAgentProperty)
router.get('/get-property/:_id', agentAuth, getSingleProperty)
router.post('/updateProperty/:_id', agentAuth, upload.single('image'), propertyUpdate)
router.delete('/delete-property/:_id', agentAuth, deleteProperty)
export default router