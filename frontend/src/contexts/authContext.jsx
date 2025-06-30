import { createContext, useContext, useState } from "react";
import axios from 'axios'
import httpStatus from 'http-status';

export const AuthContext=createContext({});
import { useNavigate } from 'react-router-dom';

const client=axios.create({
    baseURL:'http://localhost:3000/api/v1/users'
})

export const AuthProvider=({children})=>{
    
    const authContext=useContext(AuthContext);

    const [userData,setUserData]=useState(authContext);

    const handleRegister=async (fullname,username,passsword)=>{
        try{
            let request=await client.post('/register',{
                name:fullname,
                username:username,
                password:passsword
            });

            if(request.status===httpStatus.CREATED){
                return request.data?.message;
            }
        }catch(e){
            throw e;
        }
    }

    const handleLogin=async (username,passsword)=>{
        try{
            let request=await client.post('/login',{
                username:username,
                password:passsword
            });

            if(request.status===200){
                localStorage.setItem('token',request.data?.token);
                router('/');
            }
        }catch(e){
            throw e;
        }
    }

    const router= useNavigate();

    const data={
        userData,setUserData,handleRegister,handleLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}