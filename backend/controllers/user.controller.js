import {User} from "../models/user_model.js"
import httpStatus from 'http-status';
import bcrypt from "bcrypt";
import crypto from 'crypto';
import { Meeting } from "../models/meeting.model.js";

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

const getUserHistory=async (req,res)=>{
    const {token}=req.query;
    try{
        const user=await User.findOne({token:token});
        if(!user){
            return res.json({message:'User Not Found'});
        }
        const meetings=await Meeting.find({user_id:user.username});
        if(!meetings){
            res.json({message:'No Record for meetings'});
        }
        res.status(200).json(meetings);
    }catch(e){
        res.json({message:`Something went wrong ${e}`});
    }
}

const addToHistory=async (req,res)=>{
    const {token,meeting_code}=req.body;
    try{
        const user=await User.findOne({token:token});
        if(!user){
            return res.json({message:'User not found'});
        }
        const newMeeting=new Meeting({
            user_id:user.username,
            meetingCode:meeting_code
        })
        await newMeeting.save();
        res.status(httpStatus.CREATED).json({message:"Added code to history"});
    }catch(e){
        res.json({messsage:`Something went wrong${e}`});
    }
}

export {login,register,addToHistory,getUserHistory};