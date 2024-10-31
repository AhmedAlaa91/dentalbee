import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AudioRecorder from '../../microphone/micro';
import api from '../../../utilities/api';
import { MemoryRouter } from 'react-router-dom';
import '../../microphone/micro.css'
import '@testing-library/jest-dom';

class MockMediaRecorder {
    constructor(stream) {
        this.stream = stream;
        this.chunks = [];
        this.ondataavailable = null;
        this.onstop = null;
    }

    start() {
        // Simulate data being available after start
        setTimeout(() => {
            if (this.ondataavailable) {
                this.ondataavailable({ data: 'audio-chunk' });
            }
        }, 100);
    }

    stop() {
        // Simulate the stop event and triggering onstop callback
        if (this.onstop) {
            this.onstop();
        }
    }
}

// Assign the mock to the global MediaRecorder
global.MediaRecorder = MockMediaRecorder;
// Mock getUserMedia
global.navigator.mediaDevices = {
    getUserMedia: jest.fn(() => Promise.resolve({
        getTracks: jest.fn(() => [{ stop: jest.fn() }])
    }))
};
beforeAll(() => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:url');
});
// Mock API
jest.mock('../../../utilities/api', () => ({
    post: jest.fn(),
    put: jest.fn(),
}));

jest.mock('../../microphone/micro.css', () => {});


describe('AudioRecorder', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('access_token', 'test-token');
        
    });

    afterEach(() => {
        localStorage.removeItem('access_token'); // Clean up token after each test
    });

    test('starts and stops recording', async () => {
        
        render(
            <MemoryRouter>
                <AudioRecorder />
            </MemoryRouter>
        );

        // eslint-disable-next-line testing-library/no-debugging-utils
        //screen.debug();
        

        const startButton = screen.getByText(/Start Recording/i)
        fireEvent.click(startButton);

        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
        await waitFor(() => {
            expect(screen.getByText(/Stop Recording/i)).toBeInTheDocument();
        });

        const stopButton = screen.getByText(/Stop Recording/i);
        fireEvent.click(stopButton);

        await waitFor(() => {
            expect(screen.getByText(/Start Recording/i)).toBeInTheDocument();
        });
    });

    test('sends audio to API ', async () => {
        api.post.mockResolvedValueOnce({ data: { message: 'Audio sent successfully' } });
        render(
            <MemoryRouter>
                <AudioRecorder />
            </MemoryRouter>
        );

        const startButton = screen.getByText(/start recording/i);
        fireEvent.click(startButton);

        const stopButton = await screen.findByText(/stop recording/i);
        fireEvent.click(stopButton);

        // Mock the audio blob for sendAudioToAPI
        const audioBlob = new Blob(['audio data'], { type: 'audio/wav' });
        Object.defineProperty(window, 'URL', {
            value: { createObjectURL: jest.fn(() => 'blob:url') }
        });

        // Spy on FormData append method to ensure the audioBlob is added
        const formDataSpy = jest.spyOn(FormData.prototype, 'append');

        const saveButton = await screen.findByText(/save/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                '/recordings/',
                expect.any(FormData),
                expect.objectContaining({
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            );

            // Verify that audioBlob was appended to FormData with the correct key
            // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
            expect(formDataSpy).toHaveBeenCalledWith('file', audioBlob, 'recording.wav');
        });

        formDataSpy.mockRestore();
    });
});
