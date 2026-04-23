import express from 'express'
import { registerAdmin,LoginAdmin,LogOutAdmin,checkAuth } from '../controller/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const route = express.Router();


route.get('/check-auth', verifyToken, checkAuth)
route.post('/signup', registerAdmin)
route.post('/login', LoginAdmin)
route.post('/logout', LogOutAdmin)


export default route;