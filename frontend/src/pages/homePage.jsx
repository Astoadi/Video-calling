import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth';
import { Link, useNavigate } from 'react-router-dom';

import HistoryIcon from '@mui/icons-material/History';
import { Button, TextField } from '@mui/material';
import { AuthContext } from '../contexts/authContext';

function HomePage() {

  let navigate=useNavigate();

  const [meetingCode,setMeetingCode]=useState("");  
  
  let handleVideoCall=async ()=>{
    await addToUserHistory(meetingCode);
    navigate(`/meet/${meetingCode}`)
  }

  const { addToUserHistory , userData } = useContext(AuthContext);

  return (
    <div className='homePageMain h-screen'>
      <div className='topBar h-[10%] flex justify-between items-center py-2 px-2'>
          <div className='topBarLeft cursor-pointer text-4xl'>CONNECT PRO</div>
          <div className='topBarRight flex gap-2'>
            <HistoryIcon/>
            <Link to={'/history'}><div className='cursor-pointer'>HISTORY</div></Link>
            <div className='text-[#191b29] cursor-pointer' onClick={()=>{
              if (window.confirm("Are you sure you want to logout?")) {
                localStorage.removeItem('token');
                navigate('/auth');
              }
            }}>LOGOUT</div>
          </div>
      </div>
      <div className='bodyPart h-[90%] flex items-center'>
          <div className='flex flex-col justify-center w-[60%] items-center gap-2'>
               <div className='text-2xl font-bold'>Providing Quality VideoCalling and Chatting</div>
               <div className='flex gap-2'>
                <TextField id="outlined-basic" label="Meeting Code" variant="outlined" onChange={(e)=>setMeetingCode(e.target.value.trim())} />
                <Button onClick={handleVideoCall} disabled={!meetingCode.trim()} variant="contained">JOIN</Button>
               </div>
          </div>
          <div className='w-[40%]'>
            <img className='h-full w-full' src="/images/logo3.png" alt="#" />
          </div>
      </div>
    </div>
  )
}

export default withAuth(HomePage);
