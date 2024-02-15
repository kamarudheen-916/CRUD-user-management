const User = require('../model/user');
const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router() 
const crypto = require('crypto');
const path = require('path');



const signUp = async (req, res) => {
    
    try {
       
        //extract userdata from request body
        const {username,email,password } = req.body;
        console.log("req.body:",req.body);
        console.log('req.files',req.file)
        //check if user already exits 
        
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:'user with this email is already exists'})
        }
        
        //hash the password 
        const hashedPassword = await bcrypt.hash(password,10)
        const secretKey ='sdlfnbslfnbalskdbgakj'
        //create a new user
        const newUser = new User({
            username,
            email,
            password:hashedPassword,
            profile:req.file.filename
        })
        await newUser.save()
        
        //Generate JWT tocken
        const token = jwt.sign({userId :newUser._id},secretKey,{expiresIn:'1h'})
        //send success response with jwt token
        res.status(201).json({message:'user created successfully',token,username})
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const login = async(req,res)=>{
    
        try {
            const {email,password} = req.body
            
            const user = await User.findOne({email})
            console.log('user:-------',user);
            if(!user){
                return res.status(400).json({message:'The user not exist',success:false})
            }
            const passwordMacth =await bcrypt.compare(password,user.password);
            console.log('passwordMacth:====',passwordMacth);
            if(!passwordMacth){
                
                return res.status(422).json({ success: false, message: 'Invalid password' });
            }
            {
                const secretKey ='sdlfnbslfnbalskdbgakj'
                const profilePath = user.profile
                console.log('profilepath:L==========',profilePath);
                const userData ={
                    userId:user._id,
                    username:user.username,
                    profilePath,
                    email:user.email
                }
                const token = jwt.sign({userData},secretKey,{expiresIn:'1h'})
                return res.status(201).json({message:'user signedin successfully',success:true,token,username:user.username,profilePath})
            }
        } catch (error) {
            console.log('Login error :',error);
        }
}

const resetPassword = async (req,res)=>{
    try {
        const {newPassword,userId} = req.body
        console.log('newPassword:',newPassword);
        console.log('userId:',userId);
        if(!userId){
            res.json({success:false,message:'The user is not valid...!'})
        }
        if(!newPassword){
            res.json({success:false,message:'The Password is not valid...!'})
        }
        const hashedNewPassword = await bcrypt.hash(newPassword,10)
        const resetPasswordResult = await User.updateOne({_id:userId},
            {$set:{
                password:hashedNewPassword
            }})
        console.log('Password successfully updated..!',resetPasswordResult);
        res.json({success:true,message:'Password successfully updated..!'})
    } catch (error) {
        console.log(error);
    }
}
const updateImage =async (req,res)=>{
    try {
        const {userId} = req.body
        const image = req.file
        console.log('image :',userId,image);
        if(!userId && image){
            res.json({success:false,message:'cannot upload the image..!'})
        }else{
            const response = await User.updateOne({_id:userId},{
                $set:{
                    profile:image.filename
                }
            })
            const secretKey ='sdlfnbslfnbalskdbgakj'
         
            const user =  await User.findOne({_id:userId})
            const profilePath = user.profile
            const userData ={
                userId:user._id,
                username:user.username,
                profilePath,
                email:user.email
            }
            const updatedToken = jwt.sign({userData},secretKey)
            console.log("image upload response :",response);
            res.json({success:true,message:'Image successfully uploaded',updatedToken})
        }
       
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    signUp,
    login,
    resetPassword,
    updateImage,
}


