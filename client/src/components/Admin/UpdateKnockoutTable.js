import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box } from '@mui/material';

const UpdateKnockoutTable = () => {
    const [knockoutTable, setKnockoutTable] = useState('');

    const handleUpdate = async () => {
        const token = localStorage.getItem('adminToken');
        await axios.post('http://localhost:5000/api/admin/knockout-table', { knockoutTable }, {
            headers: { Authorization: `${token}` },
        });
        alert('Knockout table updated successfully');
    };

    return (
        <Box mt={4}>
            <Typography variant="h5">Update Knockout Table</Typography>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Knockout Table"
                value={knockoutTable}
                onChange={(e) => setKnockoutTable(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update
            </Button>
        </Box>
    );
};

export default UpdateKnockoutTable;
