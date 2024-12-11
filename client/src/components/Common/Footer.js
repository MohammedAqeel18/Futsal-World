import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box mt={5} mb={3}>
            <Container maxWidth="sm">
                <Typography variant="body1" align="center">
                    &copy; 2024 Futsal World. All rights reserved.
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center">
                    <Link color="inherit" href="#">
                        Privacy Policy
                    </Link>{' '}
                    |{' '}
                    <Link color="inherit" href="#">
                        Terms of Service
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
