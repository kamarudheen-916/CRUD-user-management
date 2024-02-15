const express = require('express')
const User = require('../model/user')
const bcrypt = require('bcryptjs')

const getUsers =async(req,res)=>{
    console.log('get user ---------tset');

    try {
        const user = await User.find()
        return res.status(200).json({user})
    } catch (error) {
        console.log('gerUer error :',error);
    }
}
const adminAddUser =  async(req,res)=>{
    
    try {
       
        //extract userdata from request body
        const {username,email,password } = req.body;
       
        //check if user already exits 
        
        const existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:'user with this email is already exists',success:false})
        }
        
        //hash the password 
        const hashedPassword = await bcrypt.hash(password,10)
       
        //create a new user
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })
        await newUser.save()
        
        //send success response with jwt token
        res.status(201).json({message:'user created successfully',success:true})
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

const adminEditUser = async (req,res)=>{
    try {
       
        //extract userdata from request body
        const {username,email,password } = req.body;
        console.log('test-------------:',req.body);
        //check if user already exits 
        
        //hash the password 
        const hashedPassword = await bcrypt.hash(password,10)
       
        //create a new user

        await User.updateOne({email},
            {
                $set:{
                    username,
                    email,
                    password:hashedPassword
                }
            })
       
        res.status(201).json({message:'user updated  successfully',success:true})
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}
const deleteUser = async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const userId = req.params.userId;
        console.log('id:',userId);
        // Use Mongoose to find the user by ID and delete it from the database
        const deletedUser = await User.findByIdAndDelete(userId);

        // Check if the user was found and deleted
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Send success response
        res.status(200).json({ message: 'User deleted successfully', success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const search =async ( req,res)=>{
    try {
        const searchData= req.query.searchData
        console.log('search',searchData);
        const users = await User.find({ username: { $regex: searchData, $options: 'i' } });
        if(users.length === 0){
           res.json({success:false,message:'search failed'})
        }else{
            res.json({success:true,message:'search sucessfull',users})
        }
        
    } catch (error) {
        console.log('search error :',error);
        return res.status(500).json({ success: false, message: 'Internal server error' }); // Handle other errors and send a response
    }
}

module.exports={
    getUsers,
    adminAddUser,
    adminEditUser,
    deleteUser,
    search,
}