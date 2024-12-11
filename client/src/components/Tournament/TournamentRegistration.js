import React, { useState } from 'react';
import axios from 'axios';

const TournamentRegistration = () => {
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/tournament', { teamName, members: members.split(','), date, isPaid: true }, {
                headers: { Authorization: `${localStorage.getItem('token')}` }
            });
            setMessage('Registration successful!');
            setError('');
        } catch (err) {
            setError('Error registering team');
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Register for Tournament</h2>
            <form onSubmit={handleRegistration}>
                <input
                    type="text"
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Members (comma separated emails)"
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default TournamentRegistration;
