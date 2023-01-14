import mongoose,{Schema} from "mongoose";


export interface IAgent{
    _id: string;
    name: string;
    companyName: string;
    pincode:string;
    phone: string;
    address: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable:boolean;
    rating:number;
    role:string;
    coverImage:string
}

const agentSchema = new Schema({
    name:{type:String},
    companyName:{type:String},
   email:{
    type:String,
     require:[true,'Please input your email'],
     unique:true
},
    password:{
        type:String,
        require:[true,'Please input your password'],
    },
    phone:{type:String},
    address:{type:String},
    salt:{type:String},
    pincode:{type:String},
    serviceAvailable:{type:Boolean},
    role:{type:String},
    coverImage:{type:String}
},{
    timestamps:true
}
)
const Agent =mongoose.model<IAgent>('agents',agentSchema)
export default Agent