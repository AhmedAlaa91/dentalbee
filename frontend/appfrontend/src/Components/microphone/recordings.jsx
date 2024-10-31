import React, { useEffect, useState } from 'react';
import api from '../../utilities/api'; 
import { useNavigate } from 'react-router-dom';
import './micro.css'
const apiUrl = process.env.REACT_APP_BACKEND_URL;
console.log(process.env);
function RecordingsList() {
    const [recordings, setRecordings] = useState([]); // State to store the recordings
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate();

    // Fetch recordings from the API when the component mounts
    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const response =   await api.get('/recordings/'); 
                console.log(response);
                if (!response.status===200) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                //const data = await response.json();
                setRecordings(response.data); // Set the fetched recordings
                console.log(recordings);
            } catch (error) {
                console.error('Failed to fetch recordings:', error);
            } finally {
                setLoading(false); // Stop loading indicator
            }
        };

        fetchRecordings();
    }, []);

    const deleteRecording = async (id) => {
        try {
            await api.delete(`/recordings/${id}/`); // Make sure the endpoint matches your API
            setRecordings(recordings.filter(recording => recording.id !== id)); // Update state
            console.log('Recording deleted successfully.');
        } catch (error) {
            console.error('Failed to delete recording:', error);
        }
    };

    const editRecording = (recording) => {
        navigate('/mic', { state: { recording } });
    };

    return (
        <div style={{ width: '300px', margin: 'auto', textAlign: 'center' }}>
            <h3>Your Recordings</h3>
            {loading ? (
                <p>Loading...</p>
            ) : recordings.length > 0 ? (
                <ul>
                    {recordings.map((recording, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                            <p># {index + 1} - {recording.title }</p>
                            <p>{recording.description   }</p>
                            <audio controls src={apiUrl+'/' + recording.file.replace(/^\/+/, '')}></audio>
                            <button className='actionbutton' onClick={() =>  editRecording(recording)}  style={{ marginLeft: '10px' }}>
                                Edit
                            </button>
                            <button className='actionbutton' onClick={() => deleteRecording(recording.id)} style={{ marginLeft: '10px' }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recordings found.</p>
            )}
        </div>
    );
}

export default RecordingsList;
