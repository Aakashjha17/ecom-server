import mongoose from "mongoose";

//DEFINING SCHEMA
const productSchema=new mongoose.Schema({
    name:{type:String, required:true},
    price:{type:Number,required:true},
})

//CREATING MODEL
const productModel = mongoose.model("product",productSchema);
export default  productModel