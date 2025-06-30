import React, { useContext, useState } from 'react'
import TextField from '@mui/material/TextField';
import { AuthContext } from '../contexts/authContext';
import Snackbar from '@mui/material/Snackbar';


export default function AuthenticationPage() {

    const{handleLogin,handleRegister} =useContext(AuthContext);

    const [userName,setUserName]=useState("");
    const [fullName,setFullName]=useState("");
    const [password,setPassword]=useState("");
    const [isError,setIsError]=useState("");
    const [message,setMessage]=useState("");
    const [isMode,setIsMode]=useState(0);
    const [open, setOpen] = React.useState(false);

    setTimeout(()=>{
        setIsError("");
    },5000)

    const handleAuth=async (e)=>{
        e.preventDefault();
        try{
            if(isMode===0){
                //login
                let result=await handleLogin(userName,password);
                console.log(result);
                setMessage("User Logged In Successfully");
                setOpen(true);
            }
            if(isMode===1){
                //signup
                let result=await handleRegister(fullName,userName,password);
                setMessage(result);
                setOpen(true);
                setIsMode(0);
                setPassword("");
            }
        }catch(e){
            let message=e.response.data?.message;
            setIsError(message);
        }
    }

  return (
    <div className='auth_page h-screen flex flex-col justify-between items-center lg:flex-row'>

        <div className='auth_page_left h-full w-full lg:w-[60%] bg-[url(/images/authImage.png)] bg-top-right'></div>

        <div className='auth_page_right h-full w-full lg:w-[40%] flex flex-col justify-top items-center gap-4 pt-20 pb-4'>

            <div className='flex flex-col gap-4 w-full px-6'>

                <div className='flex flex-col justify center items-center gap-4'>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>

                    <div className='flex flex-row'>
                        <div className={`cursor-pointer px-3 py-1 ${isMode==0?'bg-[#2973B2] text-white':''}`} onClick={()=>setIsMode(0)}>SIGN IN</div>
                        <div className={`cursor-pointer px-3 py-1 ${isMode==1?'bg-[#2973B2] text-white':''}`} onClick={()=>setIsMode(1)}>SIGN UP</div>
                    </div>

                </div>

                <form className='flex flex-col gap-4' onSubmit={handleAuth} >

                    {isMode===1 ?
                    <TextField id="outlined-basic1" label="Full Name" onChange={(e)=>setFullName(e.target.value)} variant="outlined" value={fullName} fullWidth required/>:<></>}

                    <TextField id="outlined-basic2" label="Username" onChange={(e)=>setUserName(e.target.value)} variant="outlined" value={userName} fullWidth required/>

                    <TextField id="outlined-basic3" label="Password" onChange={(e)=>setPassword(e.target.value)} variant="outlined" value={password} type='password' required />

                    {isError.length>0?<p className='text-[#ff0000]'>{isError}</p>:<></>}

                    <button type="submit" className='border bg-[#2973B2] text-white py-3 hover:cursor-pointer'>{isMode===0?'SIGN IN':'SIGN UP'}</button>

                </form>

            </div>

        </div>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={open}
                autoHideDuration={3000}
                message={message}
                onClose={()=>setOpen(false)}
            />

    </div>
  )
}
