const express=require('express');
const {User}=require('../db/Schema');
const {z}=require('zod');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const JwtKey=process.env.JwtKey;

const router=express.Router();

const InputSchema=z.object({
    email:z.string().email(),
    password:z.string().min(8),
    username:z.string().optional()
})

// Swagger doc for Login
/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    
    //body validation
    const IsValidInput=InputSchema.safeParse({email,password});
    if(!IsValidInput.success){
        return res.status(400).json({errors:IsValidInput.error.issues});
    }

    try{
        //finding user
        const user=await User.findOne({email,password});    
        if(!user){
            return res.status(400).json({message:'Invalid email or Password'});
        }
        const UserId=user._id;
        const token=jwt.sign({UserId},JwtKey)
        res.status(200).json({msg:'Login Successfull',token:token});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'server error'});
    }
})

// Swagger doc for Create User
/**
 * @swagger
 * /api/v1/user/createUser:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: User already exists or validation error
 *       500:
 *         description: Server error
 */

router.post('/createUser',async(req,res)=>{
    const {username,email,password}=req.body;

    //checking validation of inputs
    const IsValidInput=InputSchema.safeParse({email,password,username}); 
    if(!IsValidInput.success){
        return res.status(400).json({message:IsValidInput.error.issues});
    }

    try{
        //checking user
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }

        //creating user
        const user=await User.create({
            username,
            email,
            password
        })

        console.log(user);
        
        //generating token
        const UserId=user._id;
        const token=jwt.sign({UserId},JwtKey)
        res.status(200).json({message:'User Created Successfully',token:token});

    }catch(error){
        console.log(error);
        return res.status(500).json({message:'Server Error'});
    }
})

module.exports=router;