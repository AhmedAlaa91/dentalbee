/* eslint-disable react/no-children-prop */
import React from 'react';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import About from './About';
import Home from './Home';
import LoginSignup from './LoginSignup/LoginSignup'
import AudioRecorder from './microphone/micro'
import RecordingsList from './microphone/recordings'


const Pages = () => {

  return (
  
   
          <Routes>

            <Route path="/" element={<Home/>} />
            <Route path="/notes" element={<RecordingsList/>} />
            <Route path="/loginsignup/:actionType" element={<LoginSignup/>} />
            <Route path="/mic" element={<AudioRecorder/>} />
            
          </Routes>


  );
};

export default Pages;
