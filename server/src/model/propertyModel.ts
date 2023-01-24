import mongoose,{Schema} from "mongoose";
export interface IProperty{
    _id: string;
    name: string;
    address:string;
    description: string;
    category:string;
    propertySize: string;
    condition:string;
    price: number;
    rating:number;
    agentId:string;
    image:string
}
const propertySchema = new Schema({
    name:{type:String},
    address:{type:String},
    description:{type:String},
    category:{type:String},
    propertySize:{type:String},
    condition:{type:String},
    price:{type:Number},
    rating:{type:Number},
    agentId:{type:String},
    image:{type:String}
},
{
    timestamps:true
}
)
const Property = mongoose.model<IProperty>('Property',propertySchema)
export default Property