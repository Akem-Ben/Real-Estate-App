import express, {Request, Response} from 'express'
import { GeneratePassword, GenerateSalt, option, adminSchema} from '../Utils/utils'
import User from '../model/userModel'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'

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
        const user = await User.findOne({email})
        if(!user){
            let allUser = await User.create({
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