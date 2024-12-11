import React, { useState } from 'react';
import axios from 'axios';

const MatchmakingForm = () => {
    const [ground, setGround] = useState('');
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleMatchmaking = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/matchmaking', { ground, date, timeSlot, gender }, {
                headers: { Authorization: `${localStorage.getItem('token')}` }
            });
            setMessage('Matchmaking successful!');
            setError('');
        } catch (err) {
            setError('Error setting up matchmaking');
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Set Up a Matchmaking Slot</h2>
            <form onSubmit={handleMatchmaking}>
                <input
                    type="text"
                    placeholder="Ground"
                    value={ground}
                    onChange={(e) => setGround(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Time Slot"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    required
                />
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <button type="submit">Set Up</button>
            </form>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default MatchmakingForm;
