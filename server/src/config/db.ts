import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(`mongodb://localhost:27017/abn_estates`,()=>{
            console.log(`MongoDB connected`)
        })
    }catch(err){
        console.log(err)
    }
}

export const app_secret = process.env.APP_SECRET!
export const cloudinary_name = process.env.CLOUDINARY_CLOUD_NAME
export const cloudinary_key = process.env.CLOUDINARY_API_KEY
export const cloudinary_secret = process.env.CLOUDINARY_API_SECRET