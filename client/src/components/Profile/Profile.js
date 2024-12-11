import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Avatar, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const Input = styled('input')({
    display: 'none',
});

const Profile = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
    const [passwordChangeError, setPasswordChangeError] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageMessage, setProfileImageMessage] = useState('');
    const [profileImageError, setProfileImageError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: { Authorization: ` ${token}` }
                });
                setUser(res.data.user);
                setBookings(res.data.bookings);
                setProfileImage(res.data.user.profileImage); // Set the profile image URL
            } catch (err) {
                setError('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`http://localhost:5000/api/booking/${bookingId}`, {
                headers: { Authorization: `${token}` }
            });
            setMessage(res.data.message);
            setBookings(bookings.filter(booking => booking._id !== bookingId));
        } catch (err) {
            setError(err.response.data.message || 'Failed to cancel booking');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:5000/api/user/change-password', { currentPassword, newPassword }, {
                headers: { Authorization: `${localStorage.getItem('token')}` }
            });
            setPasswordChangeMessage(res.data.message);
            setPasswordChangeError('');
        } catch (err) {
            setPasswordChangeError('Error changing password');
            setPasswordChangeMessage('');
        }
    };

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/user/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`
                }
            });
            setProfileImageMessage(res.data.message);
            setProfileImage(res.data.profileImage); // Update profile image URL
            setProfileImageError('');
        } catch (err) {
            setProfileImageError('Error uploading profile image');
            setProfileImageMessage('');
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm">
                <Box mt={8}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Profile
                    </Typography>
                    {user && (
                        <>
                            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                                <Avatar
                                    src={profileImage ? `http://localhost:5000/${profileImage}` : 'E:\futsal_mern-main (3)\futsal_mern-main\client\src\assets\fut.jpg'}
                                    alt="Profile Image"
                                    sx={{ width: 100, height: 100, margin: 'auto' }}
                                />
                                <label htmlFor="icon-button-file">
                                    <Input accept="image/*" id="icon-button-file" type="file" onChange={handleProfileImageChange} />
                                    <IconButton color="primary" aria-label="upload picture" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                                {profileImageMessage && <Typography color="primary">{profileImageMessage}</Typography>}
                                {profileImageError && <Typography color="error">{profileImageError}</Typography>}
                            </Box>
                            <Typography variant="h6">Name: {user.firstName} {user.lastName}</Typography>
                            <Typography variant="h6">Email: {user.email}</Typography>
                            <Typography variant="h6">Contact Number: {user.contactNumber}</Typography>
                        </>
                    )}
                    <Box mt={4}>
                        <Typography variant="h5" align="center" gutterBottom>
                            My Bookings
                        </Typography>
                        {bookings.length > 0 ? (
                            bookings.map(booking => (
                                <Box key={booking._id} mt={2} p={2} border={1} borderRadius={4}>
                                    <Typography>Ground: {booking.ground}</Typography>
                                    <Typography>Date: {booking.date}</Typography>
                                    <Typography>Time Slot: {booking.timeSlot}</Typography>
                                    <Typography>Paid: {booking.isPaid ? 'Yes' : 'No'}</Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleCancelBooking(booking._id)}
                                        disabled={new Date() > new Date(new Date(booking.date).setDate(new Date(booking.date).getDate() - 1))}
                                    >
                                        Cancel Booking
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Typography>No bookings found.</Typography>
                        )}
                    </Box>
                    <Box mt={4}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Change Password
                        </Typography>
                        <form onSubmit={handleChangePassword}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                label="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                label="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Button type="submit" fullWidth variant="contained" color="primary">
                                Change Password
                            </Button>
                        </form>
                        {passwordChangeMessage && <Typography color="primary">{passwordChangeMessage}</Typography>}
                        {passwordChangeError && <Typography color="error">{passwordChangeError}</Typography>}
                    </Box>
                    {message && <Typography color="primary">{message}</Typography>}
                    {error && <Typography color="error">{error}</Typography>}
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default Profile;
