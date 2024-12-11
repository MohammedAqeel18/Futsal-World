import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PasswordReset = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/auth/reset/${token}`, { password });
            setMessage(res.data.message);
            setError('');
            navigate('/login');
        } catch (err) {
            setError('Error resetting password');
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Reset Your Password</h2>
            <form onSubmit={handlePasswordReset}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordReset;
