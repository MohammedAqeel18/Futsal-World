import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState(''); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const validatePassword = (password) => {
        return password.length >= 8; // Check if password is at least 8 characters
    };

    const checkEmailExists = async (email) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/check-email', { email });
            return res.data.exists; // Assume the server returns { exists: true/false }
        } catch (error) {
            console.error("Error checking email:", error);
            return false; // If the request fails, assume the email is not registered
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Check if password meets the requirements
        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        // Check if the email is already registered
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            setError('Email is already registered. Please use a different email.');
            return;
        }

        // Proceed with the registration
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/auth/register', { 
                firstName, 
                lastName, 
                email, 
                password, 
                contactNumber 
            });
            setLoading(false);
            navigate('/login');
        } catch (err) {
            setLoading(false);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleRegister}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Add Contact Number field */}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Contact Number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        color="primary" 
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Register;
