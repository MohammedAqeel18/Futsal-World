import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import backgroundImage from '../assets/fut.jpg'; // Make sure to place your background image in the right path
import futsalImage from '../assets/fut.jpg'; // Example image for feature sections

const Home = () => {
    return (
        <>
            <Navbar />
            <Box
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100vh',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '0 20px'
                }}
            >
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to Futsal World
                </Typography>
                <Typography variant="h5" component="p" gutterBottom>
                    Your ultimate destination for all futsal events, tournaments, and bookings.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to="/booking"
                    sx={{ mt: 3 }}
                >
                    Book a Ground Now
                </Button>
            </Box>
            <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Our Features
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={futsalImage}
                                alt="Book a Ground"
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Book a Ground
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Easily book a futsal ground for your matches and practice sessions.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={Link} to="/booking">Learn More</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={futsalImage}
                                alt="Join Tournaments"
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Join Tournaments
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Participate in exciting tournaments and showcase your skills.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={Link} to="/tournament">Learn More</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={futsalImage}
                                alt="Chat with Players"
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Chat with Players
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Connect and communicate with other players through our platform.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={Link} to="/messaging">Learn More</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Box sx={{ backgroundColor: 'primary.main', color: 'white', py: 5 }}>
                <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        Join Futsal World Today!
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Experience the best platform for booking grounds, joining tournaments, and connecting with players.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        component={Link}
                        to="/register"
                        sx={{ mt: 3 }}
                    >
                        Get Started
                    </Button>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default Home;
