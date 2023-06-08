import adminModel from "../models/admin.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//Add admin
export const adminRegistration = async(req,res)=>{
    try{
        const {name, email, password, password_confirmation,phone}=req.body;
        const admin = await adminModel.findOne({email:email})
        if(admin){
            return res.status(403).json({success: false, message:"Email already exist"})
        }else{
            if(name && email && password && password_confirmation && phone){
                if(password===password_confirmation){
                    try{
                        const salt=await bcrypt.genSalt(12)
                        const hashed_password = await bcrypt.hash(password, salt)
                        const newadmin =new adminModel({
                            name:name,
                            email:email,
                            password:hashed_password,
                            phone:phone,
                        })
                        await newadmin.save()
                        const saved_admin= await adminModel.findOne({email:email})
                        //Generating JWT TOKEN
                        const token=jwt.sign({adminID:saved_admin._id},`${process.env.JWT_SECRET_KEY}`,{expiresIn:'5D'})
                        return res.status(201).json({success: true, message:"admin registerd successfully","Token":token})
                    } catch(error){
                        return res.status(403).json({success: false, message:"Unable to register","error":error})
                    }
                }else{
                    return res.status(401).json({success: false, message:"password doesn't match"})
                }
            }else{
                return res.status(400).json({success: false, message:"All fields are required"})
            }
        }
    }catch(error){
        return res.status(500).json({success: false, message:"Something unexpected happened","error":error})
    }
}

//LOGIN
export const adminLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(email && password){
            const admin=await adminModel.findOne({email:email})
            if(admin != null){
                const isMatch = await bcrypt.compare(password, admin.password)
                if(admin.email=== email && isMatch){
                    //Generating JWT TOKEN
                    const token=jwt.sign({adminID:admin._id},`${process.env.JWT_SECRET_KEY}`,{expiresIn:'5D'})
                    res.cookie('adminToken',token);
                    
                    return res.status(200).json({
                        success: true, 
                        messaage:"success",
                        "adminData": {
                            "_id": admin._id,
                            "email": admin.email,
                            "name": admin.name,
                            "phone": admin.phone,
                            "token": token,
                        }
                    })
                }else{
                    return res.status(401).json({success: false, message:"Email or password doesn't match"})
                }
            }else{
                return res.status(404).json({success: false, message:"Email doesn't exist"})
            }
        }else{
            return res.status(400).json({success: false, message:"All fields are required"})
        }
    }catch(error){
        return res.status(500).json({success: false, message:"Something unexpected happened","error":error})
    }
}