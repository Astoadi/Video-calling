import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {

    const [isLoggedIn,setIsLoggedIn]=useState(false);

    useEffect(()=>{
        const checkIsLoggedIn=()=>{
            if(localStorage.getItem('token')){
                setIsLoggedIn(true);
                return;
            }
        }
        checkIsLoggedIn();
    },[]);

  return (
    <div className='flex flex-col p-4 text-white min-h-screen h-screen bg-cover bg-center bg-no-repeat bg-[url(/images/background.png)]'>
        
        <div className='home_page_top w-full flex flex-col gap-4 sm:flex-row justify-between items-center mt-4 px-4'>
            <div className='home_page_left font-[450] text-3xl'>Connect Pro</div>
            {!isLoggedIn?<div className='home_page_right flex items-center gap-4'>
                {/* <div className='text-[1.1rem] cursor-pointer'>Join as Guest</div> */}
                <Link to={'/auth'}>
                    <div className='text-[1.15rem] font-[550] cursor-pointer'>Register</div>
                </Link>

                <Link to={'/auth'}>
                    <div className='cursor-pointer px-10 min-w-fit w-fit py-2 text-xl text-center rounded-md bg-[#F68537]'>Login</div>
                </Link>
            </div>:<></>}
        </div>

        <div className='home_page_main h-full flex flex-col gap-2 md:flex-row justify-between items-center'>
            <div className='home_page_main_left h-full flex flex-col justify-center px-4 gap-4'>
                <div className='text-5xl/15 text-nowrap'><span className='text-[#C78A3B]'>Connect</span> with your<br/>Loved Ones</div>
                <div className='text-[#948979] text-xl'>Cover a distance by connect pro</div>
                <Link to={'/home'}>
                    <div className='px-10 w-fit min-w-fit py-2 text-xl text-center rounded-md bg-[#F68537] mt-4 cursor-pointer'>Get Started</div>
                </Link>
            </div>
            <div className='h-full min-w-[45%%] w-[50%] home_page_main_right flex items-center justify-center'>
                <img className='w-[70%] min-w-[50%]' src="/images/mobile.png" alt="#" />
            </div>
        </div>

    </div>
  )
}
