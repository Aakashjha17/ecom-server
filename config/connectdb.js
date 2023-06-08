import mongoose from 'mongoose';

mongoose.set("strictQuery", false);
const connectDB = async (DATABASE_URL) =>{
    
    try{
        await mongoose.connect(DATABASE_URL,{ useNewUrlParser: true })
        console.log("DATABASE connected")
    } catch(error){
        console.log(error)
    }
}

export default connectDB