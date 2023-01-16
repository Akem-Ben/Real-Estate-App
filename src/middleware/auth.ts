import {Request, Response, NextFunction} from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'
import {APP_SECRET} from "../config/db"
import User from '../model/userModel'
import Agent from '../model/agentModel'
import { option } from '../Utils/utils'

export const auth = async(req:JwtPayload, res:Response, next:NextFunction)=>{
    try{
        const authorization = req.headers.authorization
        if(!authorization){
            return res.status(401).json({
                Error: 'Kindly login'
            })
        }
        const token = authorization.slice(7,authorization.length)
        let verified = jwt.verify(token,"akemini12345")
        if(!verified){
            return res.status(401).json({
                Error: "Unauthorised"
            })
        }
        const {_id} = verified as {[key:string]:string}
        const user = await User.findOne({_id:_id})
        if(!user){
            return res.status(401).json({
                Error: 'Invalid Credentials'
            })
        }
        req.user = verified
        next()
    }catch(err){
        return res.status(401).json({
            Error: "Unauthorised Access"
        })
    }
}

export const agentAuth = async(req:JwtPayload, res:Response, next:NextFunction)=>{
    try{
        const authorization = req.headers.authorization
        if(!authorization){
            return res.status(401).json({
                Error: 'Kindly login'
            })
        }
        const token = authorization.slice(7,authorization.length)
        let verified = jwt.verify(token,"akemini12345")
        if(!verified){
            return res.status(401).json({
                Error: "Unauthorised"
            })
        }
        const {_id} = verified as {[key:string]:string}
        const agent = await Agent.findOne({_id:_id})
        if(!agent){
            return res.status(401).json({
                Error: 'Invalid Credentials'
            })
        }
        req.agent = verified
        next()
    }catch(err){
        return res.status(401).json({
            Error: "Unauthorised Access"
        })
    }
}
