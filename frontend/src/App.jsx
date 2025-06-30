import { useState } from 'react'
import './App.css';
import { Routes,BrowserRouter as Router,Route } from "react-router-dom"
import LandingPage from './pages/Landing';
import AuthenticationPage from './pages/authentication';
import { AuthProvider } from './contexts/authContext';
import VideoMeetComponent from './pages/videoMeet';

function App() {

  return (
    <>
      <Router>
        <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/auth' element={<AuthenticationPage/>}/>
          <Route path='/:url' element={<VideoMeetComponent/>}/>
        </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
