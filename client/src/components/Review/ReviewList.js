import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Rating } from '@mui/material';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const ReviewList = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState('');

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

    return (
        <>
            <Navbar />
            <Container maxWidth="md">
                <Box mt={8}>
                    <Typography variant="h4" align="center" gutterBottom>
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
            </Container>
            <Footer />
        </>
    );
};

export default ReviewList;
