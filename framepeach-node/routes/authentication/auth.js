import express from 'express';
import { login, register } from '../../controllers/auth.js';

const router=express.Router();


router.post('/register',register);


router.post('/login',login);

router.get('/login',(req,res)=>{
     console.log('Logout request received');

})


export default router;
