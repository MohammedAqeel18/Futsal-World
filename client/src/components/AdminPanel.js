import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get('/api/user');
            setUsers(res.data);
        };

        const fetchBookings = async () => {
            const res = await axios.get('http://localhost:5000/api/booking');
            setBookings(res.data);
        };

        const fetchTournaments = async () => {
            const res = await axios.get('http://localhost:5000/api/tournament');
            setTournaments(res.data);
        };

        fetchUsers();
        fetchBookings();
        fetchTournaments();
    }, []);

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/user/${id}`);
            const res = await axios.get('http://localhost:5000/api/user');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBooking = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/booking/${id}`);
            const res = await axios.get('http://localhost:5000/api/booking');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTournament = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tournament/${id}`);
            const res = await axios.get('http://localhost:5000/api/tournament');
            setTournaments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <h3>Users</h3>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.firstName} {user.lastName} - {user.email}
                        <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h3>Bookings</h3>
            <ul>
                {bookings.map(booking => (
                    <li key={booking._id}>
                        {booking.ground} - {booking.date} - {booking.timeSlot}
                        <button onClick={() => handleDeleteBooking(booking._id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h3>Tournaments</h3>
            <ul>
                {tournaments.map(tournament => (
                    <li key={tournament._id}>
                        {tournament.teamName} - {tournament.date}
                        <button onClick={() => handleDeleteTournament(tournament._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
