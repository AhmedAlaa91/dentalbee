import React, { useState, useRef, useEffect } from 'react';
import api from '../../utilities/api'; 
import { useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './micro.css'
function AudioRecorder() {
    const location = useLocation(); 
    const recordingData = location.state?.recording || null;
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(recordingData ? null : null);
    const [timer, setTimer] = useState(0); // Timer to track recording duration
    const [isReplaying, setIsReplaying] = useState(false); // Track if we're replaying
    const [duration, setDuration] = useState(0); // Duration of the recording
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const audioRef = useRef(null); // Reference to audio element for replay
    const timerRef = useRef(null); // Reference for the recording/replay timer

    useEffect(() => {
        if (recordingData) {
            setAudioBlob(recordingData.audioBlob); // Assuming you have audioBlob in your recording data
            setDuration(recordingData.duration || 0); // Set duration from recording data if available
        }
    }, [recordingData]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = event => audioChunks.current.push(event.data);

        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            setAudioBlob(audioBlob);
            audioChunks.current = [];
        };

        mediaRecorder.current.start();
        setRecording(true);
        setTimer(0); // Reset timer
        startTimer(); // Start the timer for recording
    };

    const stopRecording = () => {
        mediaRecorder.current.stop();
        setRecording(false);
        stopTimer(); // Stop the timer when recording stops
        setDuration(timer); // Set the duration after recording stops
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000); // Increment timer every second
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    };

    const replayRecording = () => {
        if (audioRef.current) {
            setIsReplaying(true);
            audioRef.current.currentTime = 0;
            setTimer(duration); // Set countdown starting point
    
            try {
                audioRef.current.play().then(() => {
                    // Countdown timer for replay
                    timerRef.current = setInterval(() => {
                        setTimer((prev) => {
                            if (prev <= 1) {
                                clearInterval(timerRef.current);
                                setIsReplaying(false);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                });
            } catch (error) {
                console.error("Replay audio error:", error);
            }
        }
        console.log("Audio Blob size:", audioBlob.size);
        console.log(URL.createObjectURL(audioBlob));

    };

  
    const [description, setDescription] = useState(recordingData ? recordingData.description : ''); 

    const handleInputChangeDescription = (event) => {
        setDescription(event.target.value); 
    };

    const [noteName, setNoteName] = useState(recordingData ? recordingData.title : ''); 

    const handleInputChangeNoteName = (event) => {
        setNoteName(event.target.value); 
    };

    const sendAudioToAPI = async () => {
        if (!audioBlob) return;

        const formData = new FormData();

        formData.append('file', audioBlob, 'recording.wav');
        formData.append('title', noteName);
        formData.append('description', description);
        


        try {
            if (recordingData) {
                // If we are editing, use PUT or PATCH
                const response = await api.put(`/recordings/${recordingData.id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set the content type for form data
                    },
                });
                console.log('Audio updated successfully', response.data);
            } else {
                // If we are creating a new recording
                const response = await api.post('/recordings/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Set the content type for form data
                    },
                });
                console.log('Audio sent successfully', response.data);
            }
        } catch (error) {
            console.error('Error sending audio:', error);
        }
    };
    

    useEffect(() => {
        // Cleanup interval when component unmounts
        return () => stopTimer();
    }, []);

    // Calculate progress percentage for timeline
    const progressPercentage = isReplaying
        ? ((duration - timer) / duration) * 100
        : (timer / duration) * 100;

    const token = localStorage.getItem('access_token');

     
    if (!token){
        return (
        <h1>Please SignUp or Login to use this feature</h1>
        )


    }

    else {

    return (
        <div style={{ width: '300px', margin: 'auto', textAlign: 'center' ,marginTop: '100px' }}>
            {recording ? (
                <button className='actionbutton' onClick={stopRecording}>Stop Recording</button>
            ) : (
                <button className='actionbutton' onClick={startRecording}>Start Recording</button>
            )}
            <div>
                {isReplaying ? "Replaying Time" : "Recording Time"}: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            </div>
            
            {/* Timeline container */}
            <div style={{ 
                width: '100%', 
                height: '10px', 
                backgroundColor: '#e0e0e0', 
                borderRadius: '5px', 
                overflow: 'hidden', 
                marginTop: '10px' 
            }}>
                <div style={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    backgroundColor: '#4caf50',
                    transition: 'width 0.1s ease'
                }} />
            </div>

            

            <div className='input' style={{ width: '300px',marginTop: '10px' }}>
                <img  alt=""/>
                <input type="text" placeholder='Voice Note Name'  value={noteName} onChange={handleInputChangeNoteName}  />
            </div>
            <div className='input' style={{ width: '300px',marginTop: '10px' }}>
                <img  alt=""/>
                <input type="text" placeholder='Description' value={description} onChange={handleInputChangeDescription} />
            </div>
            {audioBlob && (
                <>
                    {/* <button className='actionbutton' onClick={replayRecording} style={{ marginTop: '10px' }}>Replay</button> */}
                    <button className='actionbutton' onClick={sendAudioToAPI} style={{ marginTop: '10px' }}>Save</button>
                    {/* Audio element for replaying the recording */}
                    {/* <audio ref={audioRef} src={URL.createObjectURL(audioBlob)}  muted={false} onEnded={() => setIsReplaying(false)} /> */}
                    <audio controls ref={audioRef} src={URL.createObjectURL(audioBlob)}  onEnded={() => setIsReplaying(false)} />
                </>
            )}
        </div>
    );
}
}

export default AudioRecorder;
