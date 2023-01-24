import express, {Request, Response} from 'express'
import { GeneratePassword, GenerateSalt, option, updateSchema,
    registerSchema, loginSchema, generateToken } from '../Utils/utils'
import User from '../model/userModel'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'


//=====REGISTER======//
export const Register = async(req: Request, res: Response)=>{
    try{
        const { firstName, lastName, email, password, confirm_password, phone} = req.body
        const validateInput = registerSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        
        const salt = await GenerateSalt();
        const hashedPassword = await GeneratePassword(password,salt)
        const user = await User.findOne({email})
        if(!user){
            let allUser = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                confirm_password: hashedPassword,
                phone,
                address: "",
                salt,
                gender: "",
                lng: 0,
                lat: 0,
                verified: false,
                role: "user",
                coverImage: ""
            })
            const userExist = await User.findOne({email})
            return res.status(201).json({
                message: 'User registered successfully',
                userExist
            })
        }

        return res.status(400).json({
            message: "User already Exists",
            Error: "User already Exists"
        })
    } catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/singup"
        })
    }
}

//=============LOGIN==============//

export const Login = async(req:Request,res:Response)=>{
    try{
        const {email, password} = req.body
        const validateInput = loginSchema.validate(req.body, option)
        if(validateInput.error){
            return res.status(400).json({
                Error: validateInput.error.details[0].message
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message: "User does not exist",
                Error: "User does not exist"
            })
        }
        if(user){
            const validate = await bcrypt.compare(password, user.password)
            if(validate){
                const token = await generateToken(`${user._id}`)
                res.cookie(`token`, token)
                return res.status(200).json({
                    message: "Login Successful",
                    role: user.role,
                    email:user.email,
                    verified:user.verified
                })
            }
        }
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/login"
        })
    }
}

export const getAllUsers = async(req:Request,res:Response)=>{
    try{
        const users = await User.find({})
        return res.status(200).json({
            message: "All Users",
            users
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: "/users/get-all-users"
        })
    }
}

export const getUser = async(req:Request,res:Response)=>{
    try{
        const id = req.params._id
        const user = await User.findOne({_id:id})
        if(user){
            return res.status(200).json({
                message: "Your profile nigga!!",
                user
            })
        }
        return res.status(400).json({
            message: "user not found"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/getUser`
        })
    }
}

export const updateUser = async(req:JwtPayload,res:Response)=>{
    try{
        const id = req.params._id
        console.log(id)
        const {firstName,lastName,address,gender,phone,coverImage} = req.body
        const validateResult = updateSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
        const user = await User.findOne({_id:id})
        if(!user){
            return res.status(400).json({
                Error: "You are not authorized to update your profile"
            })
        }
        const updatedUser = await User.findOneAndUpdate({_id:id},{firstName, lastName, address, gender, phone, coverImage:req.file.path}) //{new:true})
        if(updatedUser){
            const userNew = await User.findOne({_id:id})
            return res.status(200).json({
                message: "Profile updated successfully",
                userNew
            })
        }
        return res.status(400).json({
            message: "Profile not updated"
        })
    }catch(err){
        return res.status(500).json({
            message: `Internal Server Error`,
            Error: `/users/update-user`
        })
    }
}

export const deleteUser = async(req:Request, res:Response)=>{
    try{
        const id = req.params._id
        const user = await User.findByIdAndDelete({_id:id})
        const users = await User.find({})
        if(user){
            return res.status(200).json({
                message: `User deleted`,
                users
            })
        }
    }catch(err){
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: '/users/delete-user'
        })
    }
}