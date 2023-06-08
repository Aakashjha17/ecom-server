import mongoose from "mongoose";

//DEFINING SCHEMA
const adminSchema=new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    phone:{type:Number,required:true},
})

//CREATING MODEL
const adminModel = mongoose.model("admin",adminSchema);
export default  adminModel