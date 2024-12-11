import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const Recover = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleRecover = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/recover', { email });
            setMessage('Recovery email sent. Please check your inbox.');
            setError('');
        } catch (err) {
            setError('Error sending recovery email');
            setMessage('');
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="xs">
                <Box mt={8}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Recover Password
                    </Typography>
                    <form onSubmit={handleRecover}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        {message && <Typography color="primary">{message}</Typography>}
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Recover
                        </Button>
                    </form>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default Recover;
