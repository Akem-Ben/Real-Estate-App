import jwt, {JwtPayload} from "jsonwebtoken"
import { updateSchema, option, updateAgentSchema, loginSchema, generateToken } from "../Utils/utils"
import User from "../model/userModel"
import express, {Request, Response} from "express"
import Agent from "../model/agentModel"
import bcrypt from 'bcryptjs'


export const updateAgent = async(req:JwtPayload,res:Response)=>{
    try{
        const id = req.params._id
        const {name,companyName,address,email,phone,serviceAvailable,coverImage} = req.body
        const validateResult = updateAgentSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
        const agent = await Agent.findOne({_id:id})
        if(!agent){
            return res.status(400).json({
                Error: "You are not authorized to update your profile"
            })
        }
        const updatedAgent = await Agent.findOneAndUpdate({_id:id},{name,companyName,address,email,phone,serviceAvailable,coverImage:req.file.path}) //{new:true})
        if(updatedAgent){
            const agent = await Agent.findOne({_id:id})
            return res.status(200).json({
                message: "Agent updated successfully",
                agent
            })
        }
        return res.status(400).json({
            message: "Agent Profile not updated"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/agent/update-agent`
        })
    }
}

export const agentLogin = async(req:Request,res:Response)=>{
    try{
        const {email, password} = req.body
        const validateInput = loginSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        const agent = await Agent.findOne({email})
        console.log(agent)
        if(!agent){
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            })
        }
        if(agent){
            const validate = await bcrypt.compare(password, agent.password)
            if(validate){
                const token = await generateToken(`${agent._id}`)
                res.cookie(`token`, token)
                return res.status(200).json({
                    message: "Login Successful",
                    role: agent.role,
                    email:agent.email
                })
            }
        }
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/agent/agentLogin"
        })
    }
}