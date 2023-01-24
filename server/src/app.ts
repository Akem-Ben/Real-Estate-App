import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from 'cookie-parser'
import {connectDB} from './config/db'
import UserRoutes from './routes/User'
import AdminRoutes from './routes/Admin'
import AgentRoutes from './routes/Agent'

const app = express()

dotenv.config()

connectDB()


//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(logger('dev'))
app.use(express.static(path.join(process.cwd(),'./public')))

//Routes
app.use('/users', UserRoutes)
app.use('/admin', AdminRoutes)
app.use('/agent', AgentRoutes)

app.listen(process.env.PORT,()=>{
console.log(`App paying attention on port ${process.env.PORT}`)
})

export default app