import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Rating } from '@mui/material';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const ReviewForm = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/review', { rating, comment }, {
                headers: { Authorization: `${token}` }
            });
            setMessage('Review submitted successfully');
            setError('');
        } catch (err) {
            setError('Failed to submit review');
            setMessage('');
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm">
                <Box mt={8}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Submit a Review
                    </Typography>
                    <form onSubmit={handleReviewSubmit}>
                        <Box mb={2}>
                            <Typography component="legend">Rating</Typography>
                            <Rating
                                name="rating"
                                value={rating}
                                onChange={(event, newValue) => setRating(newValue)}
                            />
                        </Box>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Comment"
                            multiline
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        {message && <Typography color="primary">{message}</Typography>}
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Submit Review
                        </Button>
                    </form>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default ReviewForm;
