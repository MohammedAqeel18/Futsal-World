import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Paper } from '@mui/material';

const ManageReservations = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/admin/reservations', {
                headers: { Authorization: `${token}` },
            });
            setReservations(res.data);
        };

        fetchReservations();
    }, []);

    const handleCancel = async (id) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this reservation?");
        if (confirmCancel) {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/reservations/${id}`, {
                headers: { Authorization: `${token}` },
            });
            setReservations(reservations.filter(reservation => reservation._id !== id));
        }
    };

    return (
        <Box mt={4}>
            <Typography variant="h5">Manage Reservations</Typography>
            {reservations.map(reservation => (
                <Paper key={reservation._id} style={{ padding: '1rem', marginTop: '1rem' }}>
                    <Typography>Ground: {reservation.ground}</Typography>
                    <Typography>Date: {reservation.date}</Typography>
                    <Typography>Time Slot: {reservation.timeSlot}</Typography>
                    <Button variant="contained" color="secondary" onClick={() => handleCancel(reservation._id)}>
                        Cancel Reservation
                    </Button>
                </Paper>
            ))}
        </Box>
    );
};

export default ManageReservations;
