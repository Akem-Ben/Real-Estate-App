import mongoose from 'mongoose'

export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(`mongodb://localhost:27017/abn_estates`,()=>{
            console.log(`MongoDB connected`)
        })
        }catch(err){
        console.log(err)
    }
}

export const APP_SECRET = process.env.APP_SECRET!
export const API_KEY = process.env.API_KEY!