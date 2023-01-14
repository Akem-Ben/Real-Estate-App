import mongoose, {Schema} from 'mongoose'

export interface IUser {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    salt: string,
    gender: string,
    lng: number,
    lat: number,
    verified: boolean,
    role: string,
    coverImage: string
}

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        require: [true, `Please input your email`],
        unique: true
    },
    password: {
        type: String,
        require: [true, `Please input your password`]
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    salt: {
        type: String
    },
    gender: {
        type: String
    },
    lng:{
        type: Number
    },
    lat:{
        type: Number
    },
    verified: {
        type: Boolean
    },
    role: {
        type: String
    },
    coverImage: {
        type: String
    }
},
{
    timestamps: true
})

const User = mongoose.model<IUser>('Users', userSchema)

export default User