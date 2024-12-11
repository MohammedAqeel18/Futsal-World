import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:5000/api/user/change-password', { currentPassword, newPassword }, {
                headers: { Authorization: `${localStorage.getItem('token')}` }
            });
            setMessage(res.data.message);
            setError('');
        } catch (err) {
            setError('Error changing password');
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Change Password</button>
            </form>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default ChangePassword;
