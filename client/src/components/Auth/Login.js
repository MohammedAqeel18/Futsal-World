import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styled } from '@mui/system';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../assets/fut.jpg';

const LoginContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
});

const StyledPaper = styled(Paper)({
    padding: '2rem',
    maxWidth: '400px',
    width: '100%',
    backdropFilter: 'blur(5px)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
});

const StyledButton = styled(Button)({
    marginTop: '1rem',
});

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // Extract the token and remove the 'Bearer ' prefix if it exists
            const fullToken = res.data.token; // 'Bearer <JWT>' or just the JWT
            const token = fullToken.startsWith('Bearer ') ? fullToken.split(' ')[1] : fullToken;
            
            // Store just the JWT in localStorage
            localStorage.setItem('token', token);
            
            // Navigate to the home page after successful login
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid credentials');
        }
    };

    return (
        <>
            <Navbar />
            <LoginContainer>
                <StyledPaper elevation={3}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleLogin}>
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
                        {error && <Typography color="error">{error}</Typography>}
                        <StyledButton type="submit" fullWidth variant="contained" color="primary">
                            Login
                        </StyledButton>
                    </form>
                    <Box mt={2} textAlign="center">
                        <Typography variant="body2">
                            Don't have an account? <Link href="/register">Register</Link>
                        </Typography>
                        <Typography variant="body2">
                            Forgot your password? <Link href="/recover">Reset Password</Link>
                        </Typography>
                        <Typography variant="body2">
                            Admin? <Link href="/admin-login">Login here</Link>
                        </Typography>
                    </Box>
                </StyledPaper>
            </LoginContainer>
            <Footer />
        </>
    );
};

export default Login;
