import mongoose from "mongoose";

//DEFINING SCHEMA
const userSchema=new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    phone:{type:Number,required:true},
})

//CREATING MODEL
const userModel = mongoose.model("user",userSchema);
export default  userModel