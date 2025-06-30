import {User} from "../models/user_model.js"
import httpStatus from 'http-status';
import bcrypt from "bcrypt";
import crypto from 'crypto';

const login=async (req,res)=>{
    const {username,password}=req.body;
    if(!username || !password ){
        return res.status(400).json({message:"Please Provide fields"});
    }
    try {
        const user=await User.findOne({username:username});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"User not found"});
        }
        let isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(isPasswordCorrect){
            let token=crypto.randomBytes(20).toString("hex");
            user.token=token;
            await user.save();
            return res.status(httpStatus.OK).json({token:token});
        }else{
            return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid username or password"})
        }
    } catch (e) {
        return res.send(httpStatus(500)).json({message:`something is wrong ${e}`});
    }
}


const register=async (req,res)=>{
    const {name,username,password}=req.body;
    try {
        const existingUser=await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            username:username,
            name:name,
            password:hashedPassword
        });
        await newUser.save();
        res.status(httpStatus.CREATED).json({message:"User Registered"});
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"Someting went wrong",error});
    }
};

export {login,register};