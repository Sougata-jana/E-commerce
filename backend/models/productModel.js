import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        Image:{
            type:Array,
            required:true,
        },
        category:{
            type:String,
            required:true
        },
        subCategory:{
            type:String,
            required:true
        },
        sizes:{
            type:Array,
            required:true
        },
        bestSeller:{
            type:Boolean
        },
        date:{
            type:Number,
            required:true
        }
    },{Timestamp:true}
)

const produCtModel = mongoose.model("products", productSchema)
export default produCtModel