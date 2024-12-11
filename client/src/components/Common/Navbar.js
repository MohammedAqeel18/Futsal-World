import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to={token ? "/home" : "/login"}>Futsal World</Button>
                </Typography>
                <Box>
                    {token ? (
                        <>
                            <Button color="inherit" component={Link} to="/profile">Profile</Button>
                            <Button color="inherit" component={Link} to="/booking">Book</Button>
                            <Button color="inherit" component={Link} to="/matchmaking">Matchmaking</Button>
                            <Button color="inherit" component={Link} to="/messaging">Messaging</Button>
                            <Button color="inherit" component={Link} to="/review">Review</Button>
                            <Button color="inherit" component={Link} to="/tournament">Tournaments</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/register">Register</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
