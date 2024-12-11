import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, MenuItem, Modal } from '@mui/material';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import MessageBox from './MessageBox';

const MatchmakingForm = () => {
    const [ground, setGround] = useState('');
    const [date, setDate] = useState('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [subSlot, setSubSlot] = useState('');
    const [amount, setAmount] = useState(20.00);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [selectedBookingId, setSelectedBookingId] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentReceiver, setCurrentReceiver] = useState('');

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
            const res = await axios.get('http://localhost:5000/api/matchmaking/available-time-slots', {
                params: { ground: selectedGround, date: selectedDate },
                headers: { Authorization: `Bearer ${token}` },
            });

            setAvailableTimeSlots(res.data.availableTimeSlots);
            setBookedSlots(res.data.bookedSlots);
        } catch (err) {
            setError('Error fetching available time slots');
        }
    };

    const handleTimeSlotClick = (slot, subSlotNumber) => {
        setSelectedTimeSlot(slot);
        setSubSlot(subSlotNumber);
    };

    const handleOpenMessageBox = (bookingId) => {
        setSelectedBookingId(bookingId);
        handleMessageUser(bookingId);
    };

    const handleMessageUser = async (bookingId) => {
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
                    bookingUser = slot.user1 ? slot.user1.id : slot.user2 ? slot.user2.id : null;
                }
            }

            setCurrentReceiver(bookingUser);
            setMessageModalOpen(true);
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

    const handleMatchmaking = async (e) => {
        e.preventDefault();

        if (!selectedTimeSlot || !subSlot) {
            setError('Please select a time slot and sub-slot.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/matchmaking/create', {
                ground,
                date,
                timeSlot: selectedTimeSlot,
                subSlot,
                amount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Booking successful!');
            setError('');
            fetchAvailableTimeSlots(date, ground);
        } catch (err) {
            setError('Error making booking');
            setMessage('');
        }
    };

    const checkSlotStatus = (slot) => {
        const bookedSlot = bookedSlots.find(bs => bs.timeSlot === slot);
        const isPartiallyBooked = bookedSlot && (bookedSlot.user1 || bookedSlot.user2);
        const isCompletelyBooked = bookedSlot && bookedSlot.user1 && bookedSlot.user2;

        return { isPartiallyBooked, isCompletelyBooked, bookedSlot };
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm">
                <Box mt={8}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Book a Time Slot for Matchmaking
                    </Typography>
                    <form onSubmit={handleMatchmaking}>
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

                        {selectedTimeSlot && (
                            <Box mt={2}>
                                <Typography variant="h6">
                                    Selected Time Slot: {selectedTimeSlot}
                                </Typography>
                            </Box>
                        )}

                        <Box mt={2}>
                            <Typography variant="h6">Available Time Slots</Typography>
                            <Grid container spacing={2} mt={1}>
                                {[...new Set(availableTimeSlots.concat(bookedSlots.map(b => b.timeSlot)))].map((slot, index) => {
                                    const { isPartiallyBooked, isCompletelyBooked, bookedSlot } = checkSlotStatus(slot);

                                    return (
                                        <Grid item xs={12} key={index}>
                                            <Box
                                                sx={{
                                                    padding: 2,
                                                    textAlign: 'center',
                                                    border: '1px solid',
                                                    borderRadius: '4px',
                                                    backgroundColor: isCompletelyBooked ? '#ffcccb' : isPartiallyBooked ? '#ffeeba' : '#f0f0f0',
                                                    color: isCompletelyBooked ? '#000' : isPartiallyBooked ? '#555' : '#000',
                                                }}
                                            >
                                                <Typography variant="h6">{slot} - {isCompletelyBooked ? "Completely Booked" : isPartiallyBooked ? "Partially Booked" : "Available"}</Typography>
                                                <Grid container spacing={1} mt={1}>
                                                    <Grid item xs={6}>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            color={bookedSlot && bookedSlot.user1 ? 'secondary' : 'primary'}
                                                            onClick={() => handleTimeSlotClick(slot, 1)}
                                                            disabled={bookedSlot && bookedSlot.user1}
                                                        >
                                                            Sub Slot 1
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            color={bookedSlot && bookedSlot.user2 ? 'secondary' : 'primary'}
                                                            onClick={() => handleTimeSlotClick(slot, 2)}
                                                            disabled={bookedSlot && bookedSlot.user2}
                                                        >
                                                            Sub Slot 2
                                                        </Button>
                                                    </Grid>
                                                </Grid>

                                                {(isPartiallyBooked || isCompletelyBooked) && (
                                                    <Box mt={2}>
                                                        <Button
                                                            variant="outlined"
                                                            color="info"
                                                            onClick={() => handleOpenMessageBox(bookedSlot.bookingId)}
                                                        >
                                                            Message
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>

                        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                            Book
                        </Button>

                        {message && (
                            <Box mt={2}>
                                <Typography variant="h6" color="primary">{message}</Typography>
                            </Box>
                        )}

                        {error && (
                            <Box mt={2}>
                                <Typography variant="h6" color="error">{error}</Typography>
                            </Box>
                        )}
                    </form>
                </Box>
            </Container>
            <Footer />

            <Modal open={messageModalOpen} onClose={() => setMessageModalOpen(false)}>
                <MessageBox
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    sendMessage={sendMessage}
                    messages={messages}
                    bookingUserId={selectedBookingId}
                    currentUserId={localStorage.getItem('userId')}
                />
            </Modal>
        </>
    );
};

export default MatchmakingForm;
