import express from 'express'
import {adminRegistration,adminLogin} from '../controllers/adminController.js'
const router = express.Router();

//User Registration
router.post('/register',adminRegistration)

//User Login
router.post('/login',adminLogin)

export default router;