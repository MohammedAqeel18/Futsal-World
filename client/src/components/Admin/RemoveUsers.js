import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Paper } from '@mui/material';

const RemoveUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `${token}` },
            });
            setUsers(res.data);
        };

        fetchUsers();
    }, []);

    const handleRemove = async (id) => {
        const confirmRemove = window.confirm("Are you sure you want to remove this user?");
        if (confirmRemove) {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                headers: { Authorization: `${token}` },
            });
            setUsers(users.filter(user => user._id !== id));
        }
    };

    return (
        <Box mt={4}>
            <Typography variant="h5">Remove Users</Typography>
            {users.map(user => (
                <Paper key={user._id} style={{ padding: '1rem', marginTop: '1rem' }}>
                    <Typography>Username: {user.username}</Typography>
                    <Typography>Email: {user.email}</Typography>
                    <Button variant="contained" color="secondary" onClick={() => handleRemove(user._id)}>
                        Remove User
                    </Button>
                </Paper>
            ))}
        </Box>
    );
};

export default RemoveUsers;
