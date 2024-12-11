import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Container, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const PaymentForm = ({ bookingDetails, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            try {
                const res = await axios.post('http://localhost:5000/api/payment', {
                    paymentMethodId: paymentMethod.id,
                    bookingDetails,
                });
                onPaymentSuccess();
                setLoading(false);
            } catch (err) {
                setError('Payment failed');
                setLoading(false);
            }
        }
    };

    return (
        <Container>
            <Box mt={4}>
                <Typography variant="h5">Complete your payment</Typography>
                <form onSubmit={handleSubmit}>
                    <CardElement />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" disabled={!stripe || loading}>
                        Pay
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default PaymentForm;
