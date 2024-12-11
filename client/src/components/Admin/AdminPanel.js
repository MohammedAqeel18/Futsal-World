import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import ManageReservations from './ManageReservations';
import UpdateKnockoutTable from './UpdateKnockoutTable';
import RemoveUsers from './RemoveUsers';
import ManageTournament from './ManageTournament'; // Include your new ManageTournament component
import QrReader from 'react-qr-scanner'; // Import the QR scanner component
import axios from 'axios'; // Import axios for making HTTP requests

const AdminPanel = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [qrData, setQrData] = useState('');

    const handleChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleScan = async (data) => {
        if (data) {
            try {
                // Parse the scanned data
                const scannedData = JSON.parse(data.text);
    
                // Extract the bookingId from the scanned data
                const { bookingId } = scannedData;
    
                setQrData(bookingId); // Set the bookingId for display or further use
    
                // Send the bookingId to the backend for validation
                const response = await axios.post(
                    'http://localhost:5000/api/booking/confirm-booking-by-qr', 
                    { bookingId },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } } // Include the token in the header
                );
    
                console.log('Booking validation response:', response.data);
                alert('Booking confirmed successfully!');
            } catch (error) {
                console.error('Error validating booking:', error);
                alert('Booking validation failed: ' + (error.response ? error.response.data.message : 'Unknown error'));
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="lg">
                <Box mt={8}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Admin Panel
                    </Typography>
                    <Tabs value={tabIndex} onChange={handleChange} centered>
                        <Tab label="Manage Reservations" />
                        <Tab label="Update Knockout Table" />
                        <Tab label="Manage Tournament" /> {/* Add a tab for Manage Tournament */}
                        <Tab label="Remove Users" />
                        <Tab label="QR Code Scanner" /> {/* Add a tab for QR scanner */}
                    </Tabs>
                    {tabIndex === 0 && <ManageReservations />}
                    {tabIndex === 1 && <UpdateKnockoutTable />}
                    {tabIndex === 2 && <ManageTournament />} {/* Add the new ManageTournament component */}
                    {tabIndex === 3 && <RemoveUsers />}
                    {tabIndex === 4 && ( /* Add the QR Scanner component */
                        <Box mt={4}>
                            <Typography variant="h5">QR Code Scanner</Typography>
                            <QrReader
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                style={{ width: '100%' }}
                            />
                            {qrData && (
                                <Typography variant="h6">Scanned Data: {qrData}</Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default AdminPanel;
