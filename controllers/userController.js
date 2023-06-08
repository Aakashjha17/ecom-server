import userModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport';
import dotenv from 'dotenv'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config()

export const getAllUser = async(req,res)=>{
    try {
        const users = await userModel.find();
    
        res.json(users);
    } catch (error) {
        
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Failed to get users" });
    }
}
//Add user
export const userRegistration = async(req,res)=>{
    try{
        const {name, email, password, password_confirmation,phone}=req.body;
        const user = await userModel.findOne({email:email})
        if(user){
            return res.status(403).json({success: false, message:"Email already exist"})
        }else{
            if(name && email && password && password_confirmation && phone){
                if(password===password_confirmation){
                    try{
                        const salt=await bcrypt.genSalt(12)
                        const hashed_password = await bcrypt.hash(password, salt)
                        const newUser =new userModel({
                            name:name,
                            email:email,
                            password:hashed_password,
                            phone:phone,
                        })
                        await newUser.save()
                        const saved_user= await userModel.findOne({email:email})
                        //Generating JWT TOKEN
                        const token=jwt.sign({userID:saved_user._id},`${process.env.JWT_SECRET_KEY}`,{expiresIn:'5D'})
                        return res.status(201).json({success: true, message:"user registerd successfully","Token":token})
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
export const userLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(email && password){
            const user=await userModel.findOne({email:email})
            if(user != null){
                const isMatch = await bcrypt.compare(password, user.password)
                if(user.email=== email && isMatch){
                    //Generating JWT TOKEN
                    const token=jwt.sign({userID:user._id},`${process.env.JWT_SECRET_KEY}`,{expiresIn:'5D'})
                    res.cookie('userToken',token);
                    
                    return res.status(200).json({
                        success: true, 
                        messaage:"success",
                        "userData": {
                            "_id": user._id,
                            "email": user.email,
                            "name": user.name,
                            "phone": user.phone,
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

passport.use(
    new GoogleStrategy(
        {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user already exists in the database
            const existingUser = await userModel.findOne({ email: profile.emails[0].value });
            if (existingUser) {
                // User already exists, proceed with authentication
                return done(null, existingUser);
            }

            // User does not exist, create a new user in the database
            const newUser = new userModel({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: 'signed via through google', // No password needed for OAuth users
                phone: 0, // Set a default value for phone if needed
            });

            await newUser.save();
            done(null, newUser);
        } catch (error) {
            done(error, null);
        }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Express route handler for Google OAuth
export const googleAuthHandler = (req, res, next) =>{
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

// Express callback route after Google OAuth
export const googleAuthCallbackHandler = (req, res, next) =>{
    passport.authenticate('google', async (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed
            return res.redirect('/login');
        }

        try {
            // Generate a JWT token
            const token = jwt.sign({ userID: user._id }, `${process.env.JWT_SECRET_KEY}`, { expiresIn: '5D' });

            // Store the token in the user's session or as a cookie
            res.cookie('userToken',token);

            // Redirect to the dashboard with the token
            res.redirect(`/dashboard?token=${token}`);
        } catch (error) {
            next(error);
        }
    })(req, res, next);
}

    