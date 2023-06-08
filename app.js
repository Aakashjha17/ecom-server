import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './config/connectdb.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import jwt from 'jsonwebtoken'

dotenv.config()
const app = express()

const port = process.env.PORT || 8000
const DATABASE_URL = process.env.DATABASE_URL

app.use(cors())

//DATABASE CONNECTION
connectDB(DATABASE_URL)

//JSON
app.use(express.json())
app.listen(port, () => {
  console.log(`server live on port: ${port}`)
})


app.post('/api/verify-token', (req, res) => {
  const { token } = req.body;

  // Perform your token verification logic here
  // This is just a sample implementation
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Token is valid
    return res.status(200).json({ success: true, message: 'Token is valid' });
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ success: false, message: 'Token is invalid' });
  }
});


app.use("/api", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/product", productRoutes)
app.use("/api/order", orderRoutes)