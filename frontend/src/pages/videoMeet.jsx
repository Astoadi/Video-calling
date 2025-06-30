import { Badge, Button, IconButton, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";

import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';

const server_url='http://localhost:3000';

var connections={};

const peerConfigConnections={
  "iceServers":[
    {"urls":"stun:stun.l.google.com:19302"}
  ]
}

export default function VideoMeetComponent() {

  var socketRef=useRef();

  let socketIdRef=useRef(); //my socket id

  let localVideoRef=useRef();

  let [videoAvailable,setVideoAvailable]=useState(true);

  let [audioAvailable,setAudioAvailable]=useState(true);

  let [video,setVideo]=useState();

  let [audio,setAudio]=useState();

  let [screen,setScreen]=useState();

  let [showModal,setShowModal]=useState();

  let [screenAvailable,setScreenAvailable]=useState();

  let [messages,setMessages]=useState([]); //chat messages

  let [message,setMessage]=useState("");

  let [newMessages,setNewMessages]=useState(0);

  let [askForUserName,setAskForUserName]=useState(true);

  let [userName,setUserName]=useState("");

  const videoRef=useRef([]);

  let [videos,setVideos]=useState([]);

  async function getPermissions(){
    try{
      const videoPermission=await navigator.mediaDevices.getUserMedia({video:true});
      if(videoPermission){
        setVideoAvailable(true);
      }else{
        setVideoAvailable(false);
      }

      const audioPermission=await navigator.mediaDevices.getUserMedia({audio:true});
      if(audioPermission){
        setAudioAvailable(true);
      }else{
        setAudioAvailable(false);
      }

      if(navigator.mediaDevices.getDisplayMedia){
        setScreenAvailable(true);
      }else{
        setScreenAvailable(false);
      }
      if(videoAvailable || audioAvailable){
        const userMediaStream=await navigator.mediaDevices.getUserMedia({video:videoAvailable,audio:audioAvailable});
        if(userMediaStream){
          window.localStream=userMediaStream;
          if(localVideoRef.current){
            localVideoRef.current.srcObject=userMediaStream;
          }
        }
      }
    }catch(e){
      console.log(e);
    }
  }

  let gotMessageFromServer=(fromId,message)=>{
    var signal=JSON.parse(message);

    if(fromId!==socketIdRef.current){
      if(signal.sdp){
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
          if(signal.sdp.type==='offer'){
            connections[fromId].createAnswer().then((description)=>{
              connections[fromId].setLocalDescription(description).then(()=>{
                socketRef.current.emit('signal',fromId,JSON.stringify({'sdp':connections[fromId].localDescription}))
              }).catch(e=>console.log(e))
            }).catch(e=>console.log(e));
          }
        }).catch(e=>console.log(e))
      }
      if(signal.ice){
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e=>console.log(e))
      }
    }
  }

  let addMessage=()=>{
    //todo
  }

  let connectToSocketServer=()=>{
    socketRef.current=io.connect(server_url,{secure:false});

    socketRef.current.on('signal',gotMessageFromServer);

    socketRef.current.on('connect',()=>{
      socketRef.current.emit('join-call',window.location.href);

      socketIdRef.current=socketRef.current?.id;

      socketRef.current.on('chat-message',addMessage);

      socketRef.current.on('user-left',(id)=>{
        setVideos((videos)=videos.filter((video)=>video.socketId!==id));
      })

      socketRef.current.on('user-joined',(id,clients)=>{
        clients.forEach((socketListId)=>{
          connections[socketListId]=new RTCPeerConnection(peerConfigConnections);

          connections[socketListId].onicecandidate=(event)=>{
            if(event.candidate!=null){
              socketRef.current.emit('signal',socketListId,JSON.stringify({'ice':event.candidate}));
            }
          }

          connections[socketListId].onaddstream=(event)=>{
            let videoExists=videoRef.current.find(video=>video.socketId===socketListId);
            
            if(videoExists){
              setVideos(videos=>{
                const updatedVideos=videos.map(video=>
                    video.socketId===socketListId?{...video,stream:event.stream}:video
                  );
                  videoRef.current=updatedVideos;
                  return updatedVideos
              })
            }else{
              let newVideo={
                socketId:socketListId,
                stream:event.stream,
                autoPlay:true,
                playsinline:true
              }
              setVideos(videos=>{
                const updatedVideos=[...videos,newVideo];
                videoRef.current=updatedVideos;
                return updatedVideos;
              });
            }
          };

          if(window.localStream!==undefined && window.localStream!==null){
            connections[socketListId].addStream(window.localStream);
          }else{
            //todo black silence
            let blackSilence = (...args)=>new MediaStream([black(...args),silence()]);
            window.localStream=blackSilence();
            connections[socketListId].addStream(window.localStream);

          }

        })

        if(id===socketIdRef.current){
          for(let id2 in connections){
            if(id2===socketIdRef.current) continue

            try{
              connections[id2].addStream(window.localStream);
            }catch(e){

            }
            connections[id2].createOffer().then((description)=>{
              connections[id2].setLocalDescription(description)
              .then(()=>{
                socketRef.current.emit('signal',id2,JSON.stringify({'sdp':connections[id2].localDescription}))
              })
              .catch((e)=>console.log(e));
            });
          }
        }
      });


    });

  };

  let getMedia=()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  }

  let connect=()=>{
    setAskForUserName(false);
    getMedia();
  }

  let handleVideo=()=>{
    setVideo(!video);
  }

  let handleAudio=()=>{
    setAudio(!audio);
  }

  let getUserMediaSuccess=(stream)=>{
    try{
      window.localStream.getTracks().forEach(track=>track.stop())
    }catch(e){
      console.log(e);
    }
    window.localStream=stream;
    localVideoRef.current.srcObject=stream;

    for(let id in connections){
      if(id===socketIdRef.current) continue;

      connections[id].addStream(window.localStream)

      connections[id].createOffer().then((description)=>{
        connections[id].setLocalDescription(description)
        .then(()=>{
          socketRef.current.emit('signal',id,JSON.stringify({'sdp':connections[id].localDescription}))
        }).catch(e=>console.log(e))
      }).catch(e=>console.log(e));
    }
    stream.getTracks().forEach(track=>track.onended=()=>{
      setVideo(false);
      setAudio(false);
      try{
        let tracks=localVideoRef.current.srcObject.getTracks()
        tracks.forEach(track=>track.stop())
      }catch(e){
        console.log(e);
      }

      //todo black silence 

      let blackSilence = (...args)=>new MediaStream([black(...args),silence()]);
            window.localStream=blackSilence();
            localVideoRef.current.srcObject=window.localStream;


      for(let id in connections){
        connections[id].addStream(window.localStream);
        connections[id].createOffer().then((description)=>{
          connections[id].setLocalDescription(description)
          .then(()=>{
            socketRef.current.emit('signal',id,JSON.stringify({'sdp':connections[id].localDescription}))
          }).catch(e=>console.log(e));
        })
      }
    })
  }

  let silence=()=>{
    let ctx=new AudioContext();
    let oscillator=ctx.createOscillator();

    let dst=oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume()
    return Object.assign(dst.stream.getAudioTracks()[0],{enabled:false});
  }

  let black=({width=640,height=400}={})=>{
    let canvas=Object.assign(document.createElement('canvas'),{width,height});
    canvas.getContext('2d').fillRect(0,0,width,height);
    let stream=canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0],{enabled:false});
  }
  
  let getUserMedia=()=>{
    if((video && videoAvailable) ||(audio && audioAvailable)){
      navigator.mediaDevices.getUserMedia({video:video,audio:audio})
      .then(getUserMediaSuccess)
      .then((stream)=>{ })
      .catch((e)=>console.log(e));
    }else{
      try{
        let tracks=localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track=>track.stop());
      }catch(e){ }
    }
  }

  useEffect(()=>{
    if(video!==undefined && audio !==undefined){
      getUserMedia();
    }
  },[audio,video])

  useEffect(()=>{
    getPermissions();
  },[])

  return (
    <div>{
      askForUserName===true?

        <div>
            <h2>Enter into Lobby</h2>
            <TextField label='UserName' variant='outlined' value={userName} onChange={(e)=>setUserName(e.target.value)} required/>
            <Button variant="outlined" onClick={connect}>Connect</Button>

            <div>
              <video ref={localVideoRef} autoPlay muted/>
            </div>

        </div>:
        <div className='meetVideoContainer bg-[#191b29] relative h-screen'>

            <div className='buttonContainer absolute w-screen bottom-0 text-center'>
              <IconButton onClick={handleVideo}>
                {(video===true)?<VideocamIcon sx={{color:"#fff"}} fontSize='large'/>:<VideocamOffIcon sx={{color:"#fff"}} fontSize='large'/>}
              </IconButton>
              <IconButton>
                <CallEndIcon sx={{color:"#d60004"}} fontSize='large'/>
              </IconButton>
              <IconButton onClick={handleAudio}>
                {audio===true?<MicIcon sx={{color:"#fff"}} fontSize='large' />:<MicOffIcon sx={{color:"#fff"}} fontSize='large' />}
              </IconButton>
              {screenAvailable===true?
              <IconButton>
                {screen===true?<ScreenShareIcon sx={{color:"#fff"}} fontSize='large'/>:<StopScreenShareIcon sx={{color:"#fff"}} fontSize='large'/>}
              </IconButton>:<></>}

              <Badge badgeContent={newMessages} max={999} color='secondary'>
                <IconButton>
                  <ChatIcon sx={{color:"#fff"}} fontSize='large'/>
                </IconButton>
              </Badge>
            </div>

            <video className='meetUserVideo border rounded-xl absolute bottom-[10vh] right-[10px] h-[20vh] w-auto' ref={localVideoRef} autoPlay muted></video>    

            {videos.map((video)=>(
              <div className='conferenceView' key={video.socketId}>
                {/* <h2>{video.socketId}</h2> */}

                <video 
                data-socket={video.socketId}
                ref={ref=>{
                  if(ref && video.stream){
                    ref.srcObject=video.stream;
                  }
                }}
                autoPlay
                >
                </video>
              </div>
            ))}    
        </div>

      }</div>
  )
}
