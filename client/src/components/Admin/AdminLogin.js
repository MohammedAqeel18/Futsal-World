import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
            localStorage.setItem('adminToken', res.data.token);
            window.location.href = '/admin';
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8}>
                <Typography variant="h4" align="center" gutterBottom>
                    Admin Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" color="primary">
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default AdminLogin;
