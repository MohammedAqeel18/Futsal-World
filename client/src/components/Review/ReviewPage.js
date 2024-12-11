import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper, Rating } from '@mui/material';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const ReviewPage = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/review', {
                    headers: { Authorization: `${token}` }
                });
                setReviews(res.data);
            } catch (err) {
                setError('Failed to fetch reviews');
            }
        };

        fetchReviews();
    }, []);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/review', { rating, comment }, {
                headers: { Authorization: `${token}` }
            });
            setMessage('Review submitted successfully');
            setError('');
            setReviews([...reviews, res.data]); // Add the new review to the list
        } catch (err) {
            setError('Failed to submit review');
            setMessage('');
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="md">
                <Box mt={8}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Reviews
                    </Typography>
                    <Box mb={4}>
                        <Typography variant="h5" align="center" gutterBottom>
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
                    <Box>
                        <Typography variant="h5" align="center" gutterBottom>
                            User Reviews
                        </Typography>
                        {error && <Typography color="error">{error}</Typography>}
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <Paper key={review._id} style={{ padding: '1rem', marginBottom: '1rem' }}>
                                    <Box mb={1}>
                                        <Typography variant="h6">{review.user.firstName} {review.user.lastName}</Typography>
                                        <Rating value={review.rating} readOnly />
                                    </Box>
                                    <Typography>{review.comment}</Typography>
                                </Paper>
                            ))
                        ) : (
                            <Typography>No reviews found.</Typography>
                        )}
                    </Box>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default ReviewPage;
