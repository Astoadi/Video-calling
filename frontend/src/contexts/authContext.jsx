import { createContext, useContext, useState } from "react";
import axios from 'axios'
import httpStatus from 'http-status';

import { useNavigate } from 'react-router-dom';

export const AuthContext=createContext({});

const client=axios.create({
    baseURL:'http://localhost:3000/api/v1/users'
})

export const AuthProvider=({children})=>{

    const router= useNavigate();
    
   // const authContext=useContext(AuthContext);

    const [userData,setUserData]=useState(null);

    const handleRegister=async (fullname,username,password)=>{
        try{
            let request=await client.post('/register',{
                name:fullname,
                username:username,
                password:password
            });

            if(request.status===httpStatus.CREATED){
                return request.data?.message;
            }
        }catch(e){
            throw e;
        }
    }

    const handleLogin=async (username,password)=>{
        try{
            let request=await client.post('/login',{
                username:username,
                password:password
            });

            if(request.status===200){
                localStorage.setItem('token',request.data?.token);
                setUserData({ username, token: request.data?.token });
                router('/home');
            }
        }catch(e){
            throw e;
        }
    }

    

    const getHistoryOfUser=async ()=>{
        try{
            const response=await client.get('/get_all_activity',{
                params:{
                    token:localStorage.getItem('token')
                }
            });
            return response.data
        }catch(e){
            throw e;
        }
    }

    const addToUserHistory=async (meetingCode)=>{
        try{
            let request=await client.post('/add_to_activity',{
                token:localStorage.getItem('token'),
                meeting_code:meetingCode
            })
            return request.data;
        }catch(e){
            throw e;
        }
    }

    const data={
        userData,setUserData,handleRegister,handleLogin,getHistoryOfUser,addToUserHistory
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}