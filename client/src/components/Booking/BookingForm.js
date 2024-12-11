import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, MenuItem, Modal } from '@mui/material';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import MessageBox from './MessageBox';

const BookingForm = () => {
    const [ground, setGround] = useState('');
    const [date, setDate] = useState('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [amount, setAmount] = useState(20.00);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [currentReceiver, setCurrentReceiver] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState('');
    const [messages, setMessages] = useState([]);

    // Get today's date in the format 'YYYY-MM-DD'
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (date && ground) {
            fetchAvailableTimeSlots(date, ground);
        }
    }, [date, ground]);

    const fetchAvailableTimeSlots = async (selectedDate, selectedGround) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/booking/available-time-slots', {
                params: { ground: selectedGround, date: selectedDate },
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setAvailableTimeSlots(res.data.availableTimeSlots);
            setBookedSlots(res.data.bookedSlots);
            console.log("Booked Slots:", res.data.bookedSlots);
        } catch (err) {
            setError('Error fetching available time slots');
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedTimeSlot) {
            setError('Time slot is required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/booking/book', {
                ground,
                date,
                timeSlot: selectedTimeSlot,
                amount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Booking successful! A confirmation email has been sent.');
            setError('');
        } catch (err) {
            setError('Error making booking');
            setMessage('');
        }
    };

    const handleTimeSlotClick = (slot, bookingId) => {
        if (bookingId) {
            setSelectedTimeSlot(slot);
            setSelectedBookingId(bookingId);
            handleMessageUser(bookingId);
        } else {
            setSelectedTimeSlot(slot);
            setMessageModalOpen(false);
        }
    };

    const handleMessageUser = async (bookingId) => {
        if (!bookingId) {
            return;
        }
        setMessageModalOpen(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/message/inbox`, {
                params: { bookingId },
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data); 
            let bookingUser = res.data.length > 0 ? res.data[0].sender._id : null;
    
            if (!bookingUser) {
                const slot = bookedSlots.find(slot => slot.bookingId === bookingId);
                if (slot) {
                    bookingUser = slot.userId;
                }
            }
            
            setCurrentReceiver(bookingUser);
        } catch (err) {
            console.error('Error fetching messages:', err);
            alert('Error fetching messages');
        }
    };

    const sendMessage = async () => {
        const currentUserId = localStorage.getItem('userId');

        if (!currentReceiver || !messageContent) {
            alert('Receiver or message content cannot be empty!');
            return;
        }

        if (!currentUserId) {
            alert('Current User ID is undefined');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/message/send', {
                receiver: currentReceiver,
                content: messageContent,
                bookingId: selectedBookingId,
                sender: currentUserId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessageContent('');
            handleMessageUser(selectedBookingId);
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Error sending message');
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm">
                <Box mt={8}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Book a Time Slot
                    </Typography>
                    <form onSubmit={handleBooking}>
                        <TextField
                            select
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Ground"
                            value={ground}
                            onChange={(e) => setGround(e.target.value)}
                        >
                            <MenuItem value="">Select a ground</MenuItem>
                            <MenuItem value="Football">Football</MenuItem>
                            <MenuItem value="Cricket">Cricket</MenuItem>
                        </TextField>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            inputProps={{ min: today }}  // Restrict past dates
                        />

                        {/* Display available time slots */}
                        <Box mt={2}>
                            <Typography variant="h6">Available Time Slots</Typography>
                            <Grid container spacing={2} mt={1}>
                                {availableTimeSlots.map((slot, index) => (
                                    <Grid item xs={4} key={index}>
                                        <Box
                                            onClick={() => handleTimeSlotClick(slot, null)}
                                            sx={{
                                                padding: 2,
                                                textAlign: 'center',
                                                border: '1px solid',
                                                borderRadius: '4px',
                                                backgroundColor: selectedTimeSlot === slot ? '#4caf50' : '#f0f0f0',
                                                color: selectedTimeSlot === slot ? '#fff' : '#000',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: selectedTimeSlot === slot ? '#45a049' : '#e0e0e0',
                                                },
                                            }}
                                        >
                                            {slot}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Display booked time slots */}
                        <Box mt={2}>
                            <Typography variant="h6">Booked Time Slots</Typography>
                            <Grid container spacing={2} mt={1}>
                                {bookedSlots.map((slot, index) => (
                                    <Grid item xs={4} key={index}>
                                        <Box
                                            onClick={() => handleTimeSlotClick(slot.timeSlot, slot.bookingId)}
                                            sx={{
                                                padding: 2,
                                                textAlign: 'center',
                                                border: '1px solid',
                                                borderRadius: '4px',
                                                backgroundColor: '#ffcccb',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {slot.timeSlot} - {slot.userEmail}
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleMessageUser(slot.bookingId)}
                                                sx={{ marginTop: 1 }}
                                            >
                                                Message
                                            </Button>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        {message && <Typography color="primary">{message}</Typography>}
                        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                            Book
                        </Button>
                    </form>
                </Box>
            </Container>
            <Footer />

            {/* Modal for messaging */}
            <Modal
                open={messageModalOpen}
                onClose={() => setMessageModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <MessageBox
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    sendMessage={sendMessage}
                    messages={messages}
                    bookingUserId={bookedSlots.find(slot => slot.bookingId === selectedBookingId)?.userId}
                    currentUserId={localStorage.getItem('userId')}
                    onClose={() => setMessageModalOpen(false)}
                />
            </Modal>
        </>
    );
};

export default BookingForm;
