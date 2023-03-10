import jwt, {JwtPayload} from "jsonwebtoken"
import { updateSchema, option, updateAgentSchema, loginSchema, generateToken, updatePropertySchema } from "../Utils/utils"
import User from "../model/userModel"
import express, {Request, Response} from "express"
import Agent from "../model/agentModel"
import bcrypt from 'bcryptjs'
import Property from "../model/propertyModel"


export const updateAgent = async(req:JwtPayload,res:Response)=>{
    try{
        const _id = req.params._id
        console.log(_id)
        const {name,companyName,address,email,phone,serviceAvailable,coverImage} = req.body
        const validateResult = updateAgentSchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }
        const agent = await Agent.findOne({_id})
        if(!agent){
            return res.status(400).json({
                Error: "You are not authorized to update your profile"
            })
        }
        const updatedAgent = await Agent.findOneAndUpdate({_id},{name,companyName,address,email,phone,serviceAvailable,coverImage:req.file.path}) //{new:true})
        if(updatedAgent){
            const agent = await Agent.findOne({_id})
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
        // console.log(agent)
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

export const createProperty = async(req:JwtPayload, res:Response)=>{
    try{
        const _id = req.agent._id
        // console.log(_id)
        const {name, description, address, category, image} = req.body

        // const salt = await GenerateSalt()
        // const agentPassword = await GeneratePassword(password,salt)
        const agent = await Agent.findById({_id}).populate('property')
        // const author = await Author.findById(id).populate('books')
        // const Admin = await User.findOne({_id})
            if(agent){
                const createProperty = await Property.create({
                    name,
                    address,
                    description,
                    category,
                    propertySize: "",
                    condition: "",
                    price: 0,
                    rating: 0,
                    agentId: _id,
                    image: req.file.path
                });
                agent.property.push(createProperty)
                agent.save()
                return res.status(201).json({
                    message: "Property created successfully",
                    createProperty
                })
            }
            return res.status(400).json({
                message: "unauthorised access"
            })

    }catch(err){
        return res.status(500).json({
        message: "Internal Server Error",
        Error: "/agent/create-property"
        })
    }

}

export const getAllAgentProperty = async (req:JwtPayload,res:Response) => {
try{
    const _id = req.agent._id
    const properties = await Property.find({})
    const agent = await Agent.findById({_id})
    if(agent){
    return res.status(200).json({
        message: "All Properties",
        properties
    })
}
return res.status(400).json({
    message: "unauthorised access"
})
}catch(err){
    return res.status(500).json({
        message: "Internal Server Error",
        Error: "/agent/create-property"
    })
}
}

export const getSingleProperty = async (req:Request, res:Response) => {
    try{
      
        const _id = req.params._id
        
        const property = await Property.findOne({_id})
        // const agent = await Agent.findById({_id})
        if(property){
        return res.status(200).json({
            message: "Your Property",
            property
        })
    }
    return res.status(400).json({
        message: "property not found"
    })
    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error",
            Error: "/agent/create-property"
        })
    }
}

export const propertyUpdate = async(req:JwtPayload,res:Response)=>{
    try{
        const id = req.params._id
        const {name,description,address,category,price,propertySize,condition,image}= req.body
        const validateResult = updatePropertySchema.validate(req.body,option)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
        const property= await Property.findOne({id})
        if(!property){
            return res.status(400).json({
                Error: "You are not authorized to update this property",
            });
        }
        const updatedProperty = await Property.findOneAndUpdate({id},{
            name,description,address,category,price,propertySize,condition,
            image:req.file.path
        })
        // console.log(property)
        if(updatedProperty){
            const propz = await Property.findOne({id})
            return res.status(200).json({
                message:'Property updated',
                propz
            })
        }
        return res.status(400).json({
            message: "Error occurred",
          });
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error',
            Error: "/agent/updateProperty/:_id"
        })
    }
}

export const deleteProperty = async (req:JwtPayload, res:Response)=>{
    try{
        const id = req.params._id
        const delProperty = await Property.findByIdAndDelete({_id:id})
        const property = await Property.find({})
        // console.log(property)
        if(property){
            return res.status(200).json({
                message: `Property deleted`,
                property
            })
        }
        return res.status(400).json({
            message: 'Unable to delete'
        })
    }catch(err){
        return res.status(500).json({
            message: 'Internal Server Error',
            Error: '/agent/delete-property'
        })
    }
}