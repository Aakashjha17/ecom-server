import express from 'express'
const router = express.Router();
import { googleAuthHandler,googleAuthCallbackHandler,userRegistration,userLogin,getAllUser} from '../controllers/userController.js';



//User Registration
router.post('/user/register',userRegistration)

//User Login
router.post('/user/login',userLogin)

//Get all user
router.get('/getAllUser', getAllUser);


// Route for Google OAuth login
router.get('/google', googleAuthHandler);

// Route for Google OAuth callback
router.get('/google/callback', googleAuthCallbackHandler);

export default router;

