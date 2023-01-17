import express, {Request, Response} from 'express'
import { GeneratePassword, GenerateSalt, option, adminSchema, agentSchema} from '../Utils/utils'
import User from '../model/userModel'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import Agent from '../model/agentModel'

export const CreateSuperadmin = async(req:JwtPayload, res:Response)=>{
    try{
        const { firstName, lastName, email, password, phone} = req.body
        const validateInput = adminSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        
        const salt = await GenerateSalt();
        const superAdminHashedPassword = await GeneratePassword(password,salt)
        const superAdmin = await User.findOne({email})
        if(!superAdmin){
            let allAdmin = await User.create({
                firstName,
                lastName,
                email,
                password: superAdminHashedPassword,
                phone,
                address: "",
                salt,
                gender: "",
                lng: 0,
                lat: 0,
                verified: true,
                role: "Super Admin",
                coverImage: ""
            })
            const superAdminExist = await User.findOne({email})
            return res.status(201).json({
                message: 'Admin registered successfully',
                superAdminExist
            })
        }

        return res.status(400).json({
            message: "Admin already Exists",
            Error: "Admin already Exists"
        })
    }catch(err){
        return res.status(500).json({
            message: "Internal Server error",
            Error: "/admin/create-superadmin"
        })
    }
}

export const CreateAdmin = async(req:JwtPayload, res:Response)=>{
    try{
        const _id = req.params._id
        const { firstName, lastName, email, password, phone} = req.body
        const validateInput = adminSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        
        const salt = await GenerateSalt();
        const superAdminHashedPassword = await GeneratePassword(password,salt)
        const admin = await User.findOne({_id})
        if(admin?.email === email){
            return res.status(400).json({
                message: "Email already exists"
            })
        }
        
        if(admin?.phone === phone){
            return res.status(400).json({
                message: "Phone number already exists"
            })
        }
        if(admin?.role === 'Super Admin'){
            let allUser = await User.create({
                firstName,
                lastName,
                email,
                password: superAdminHashedPassword,
                confirm_password: superAdminHashedPassword,
                phone,
                address: "",
                salt,
                gender: "",
                lng: 0,
                lat: 0,
                verified: true,
                role: "Admin",
                coverImage: ""
            })
            const superAdminExist = await User.findOne({email})
            console.log(superAdminExist)
            return res.status(201).json({
                message: 'Admin created successfully',
                verified: superAdminExist?.verified,
                email: superAdminExist?.email,
                lastName: superAdminExist?.lastName
            })
        }

        return res.status(400).json({
            message: "Admin already Exists",
            Error: "Admin already Exists"

    })
}catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            Error: "/admin/create-admin"
        })
    }
}

export const CreateAgent = async(req:JwtPayload, res:Response)=>{
    try{
        const _id = req.user._id
        const {name, companyName, email, password, phone} = req.body
        const validateInput = agentSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }

        const salt = await GenerateSalt()
        const agentPassword = await GeneratePassword(password,salt)
        const agent = await Agent.findOne({email})
        const Admin = await User.findOne({_id})

        if(Admin?.role === "admin" || Admin?.role === "Super Admin"){
            if(!agent){
                const createAgent = await Agent.create({
                    name,
                    companyName, 
                    pincode: "",
                    phone,
                    address:"",
                    email,
                    password: agentPassword,
                    salt,
                    serviceAvailable:false,
                    rating:0,
                    role:"agent",
                    property: [],
                    coverImage:""
                });
                return res.status(201).json({
                    message: "Agent created successfully",
                    createAgent
                })
            }
            return res.status(400).json({
                message: "Agent already exists"
            })
        }
        return res.status(400).json({
            message: "unauthorised access"
        })

    }catch(err){
        return res.status(500).json({
        message: "Internal Server Error",
        Error: "/admin/create-agent"
        })
    }

}
export const getAllAgents = async(req:Request,res:Response)=>{
    try{
        // const _id = req.params._id
        // const Admin = await User.findOne({_id})
        // if(Admin?.role === "admin" || Admin?.role === "Super Admin"){
        const agents = await Agent.find({})
        return res.status(200).json({
            message: "All Agents",
            agents
        })
    // }
    // return res.status(400).json({
    //     message: "unauthorised access"
    // })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/admin/get-all-agents"
        })
    }
}

export const getSingleAgent = async(req:Request,res:Response)=>{
    try{
        const _id = req.params._id
        console.log(_id)
        const agent = await Agent.findOne({_id:_id})
        if(agent){
            return res.status(200).json({
                message: "Agent profile!!",
                agent
            })
        }
        return res.status(400).json({
            message: "agent not found"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/admin/get-single-agent`
        })
    }
}

export const deleteAgent = async (req:Request, res:Response)=>{
    try{
        const id = req.params._id
        const agent = await Agent.findByIdAndDelete({_id:id})
        const agents = await Agent.find({})
        if(agent){
            return res.status(200).json({
                message: `Agent deleted`,
                agents
            })
        }
    }catch(err){
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: '/admin/delete-agent'
        })
    }
}