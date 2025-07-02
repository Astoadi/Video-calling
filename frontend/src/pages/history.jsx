import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import withAuth from '../utils/withAuth';
import HomeIcon from '@mui/icons-material/Home';

function History() {
    const {getHistoryOfUser}=useContext(AuthContext);
    const [meetings,setMettings]=useState([]);
    const navigate=useNavigate();
    useEffect(()=>{
        const fetchHistory=async ()=>{
            try {
                const history=await getHistoryOfUser();
                setMettings(history);
            } catch (error) {
                throw error
            }
        }
        fetchHistory();
    },[])


  return (
    <div className='p-4'>
        <div className='fixed right-5'>
            <HomeIcon onClick={()=>navigate('/home')} sx={{width:"2.5rem",height:"2.5rem"}} className='cursor-pointer mt-2 ml-2'/>
        </div>
        {meetings.length>0?
            meetings.map((e,idx)=>{
                return (
                    <div key={idx} className='my-2'>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                    USER-NAME:{e?.user_id}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
                                    MEETING CODE:{e?.meetingCode}
                                </Typography>
                                <Typography variant='body2' sx={{ color: 'text.secondary'}}>
                                    DATE: {e?.date ? new Date(e.date).toLocaleString() : 'Invalid Date'}
                                </Typography>

                            </CardContent>
                            
                        </Card>
                    </div>
                )
            }):<p className='text-3xl px-2 py-2 font-bold'>No Meeting History !</p>}
    </div>
  )
}

export default withAuth(History);