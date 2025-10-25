import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        cartData:{
            type:Object,
            default:{}
        }
    },{timestamp:true},{minimize:true}
)

const userModel = mongoose.model("users", userSchema)

export default userModel 