import { useState } from 'react'
import './App.css';
import { Routes,BrowserRouter as Router,Route } from "react-router-dom"
import LandingPage from './pages/Landing';
import AuthenticationPage from './pages/authentication';
import { AuthProvider } from './contexts/authContext';
import VideoMeetComponent from './pages/videoMeet';
import HomePage from './pages/homePage';
import History from './pages/history';

function App() {

  return (
    <>
      <Router>
        <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/auth' element={<AuthenticationPage/>}/>
          <Route path='/meet/:url' element={<VideoMeetComponent/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/history' element={<History/>}/>
        </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
