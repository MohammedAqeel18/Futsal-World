import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Modal, Paper, Select, MenuItem, FormControl, InputLabel, Card, CardMedia, CardContent  } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const stripePromise = loadStripe('pk_test_51PPc3URrD4b010W8QOFpzvoCilAbMB7ymZAbQHEiI2nJj0k1Dv1bv560gW4yIKxdLVVpepT0lwgUQ7rljtbDyQxU00aa7oLKeW');

const TournamentRegistrationForm = () => {
    const [teamName, setTeamName] = useState('');
    const [coachName, setCoachName] = useState('');
    const [members, setMembers] = useState('');
    const [tournamentType, setTournamentType] = useState('');
    const [amount, setAmount] = useState(50.00); // Example amount
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [open, setOpen] = useState(false);
    const [availableTournaments, setAvailableTournaments] = useState([]);

    useEffect(() => {
        // Fetch available tournaments
        const fetchTournaments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/tournament/available');
                setAvailableTournaments(res.data);
            } catch (err) {
                console.error('Error fetching tournaments:', err);
            }
        };
        fetchTournaments();
    }, []);

    useEffect(() => {
        // Set the registration amount based on the selected tournament type
        if (tournamentType === 'cricket') {
            setAmount(60.00); // Example amount for Cricket Tournament
        } else if (tournamentType === 'football') {
            setAmount(50.00); // Example amount for Football Tournament
        }
    }, [tournamentType]);

    const handleRegistration = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/tournament/register', {
                teamName,
                coachName,
                members,
                tournamentType
            }, {
                headers: { Authorization: `${token}` }
            });

            setMessage('Team registered successfully. Please complete your payment.');
            setError('');
            const paymentRes = await axios.post('http://localhost:5000/api/tournament/create-payment-intent', {
                amount
            }, {
                headers: { Authorization: `${token}` }
            });
            setMessage('')
            setClientSecret(paymentRes.data.clientSecret);
            setOpen(true); // Open the modal
        } catch (err) {
            setError('Error registering team');
            setMessage('');
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm">
                <Box mt={8}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Tournament Registration
                    </Typography>
                    <form onSubmit={handleRegistration}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Team Name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Coach Name"
                            value={coachName}
                            onChange={(e) => setCoachName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Members"
                            value={members}
                            onChange={(e) => setMembers(e.target.value)}
                            helperText="Enter team members separated by commas"
                        />
                        <FormControl variant="outlined" fullWidth margin="normal" required>
                            <InputLabel>Tournament Type</InputLabel>
                            <Select
                                value={tournamentType}
                                onChange={(e) => setTournamentType(e.target.value)}
                                label="Tournament Type"
                            >
                                <MenuItem value="cricket">Cricket Tournament (Saturdays)</MenuItem>
                                <MenuItem value="football">Football Tournament (Sundays)</MenuItem>
                            </Select>
                        </FormControl>
                        {error && <Typography color="error">{error}</Typography>}
                        {message && <Typography color="primary">{message}</Typography>}
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Register Team
                        </Button>
                    </form>

                    <Typography variant="h5" align="center" gutterBottom>
                        Available Tournaments
                    </Typography>
                    {availableTournaments.map(tournament => (
                        <Card key={tournament.id} style={{ marginTop: '1rem' }}>
                            <CardMedia
                                component="img"
                                alt={tournament.name}
                                height="140"
                                image="C:\\Users\\samuj\\Desktop\\My Files\\Projects\\futsal-world\\futsal_mern\\client\\public\\futsal-crest-png.webp"
                                title={tournament.name}
                            />
                            <CardContent>
                                <Typography variant="h6">{tournament.name}</Typography>
                                <Typography variant="body2" color="textSecondary">{tournament.date}</Typography>
                                <Typography variant="body2" color="textSecondary">{tournament.info}</Typography>
                            </CardContent>
                        </Card>
                    ))}



                    {clientSecret && (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <PaymentModal open={open} setOpen={setOpen} clientSecret={clientSecret} amount={amount} teamName={teamName} />
                        </Elements>
                    )}
                </Box>
            </Container>
            <Footer />
        </>
    );
};

const PaymentModal = ({ open, setOpen, clientSecret, amount, teamName }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();
        const cardElement = elements.getElement(CardElement);

        if (!stripe || !cardElement) {
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            }
        });

        if (result.error) {
            setError(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                setMessage('Payment successful! Tournament registration confirmed.');
                setError('');
                setOpen(false); // Close the modal

                // Send QR code via email
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/tournament/send-qr-code', {
                    paymentIntentId: result.paymentIntent.id,
                    email: 'user@example.com', // Replace with the actual user email
                    teamName
                }, {
                    headers: { Authorization: `${token}` }
                });
                setMessage('Payment successful! Booking confirmed.');
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Paper style={{ padding: '2rem', maxWidth: '500px', margin: '2rem auto' }}>
                <Typography variant="h6" gutterBottom>
                    Confirm Your Payment
                </Typography>
                <Typography variant="body1">Amount: ${amount}</Typography>
                <form onSubmit={handlePayment}>
                    <CardElement />
                    <Button type="submit" fullWidth variant="contained" color="primary">
                        Pay
                    </Button>
                </form>
            </Paper>
        </Modal>
    );
};

export default TournamentRegistrationForm;
