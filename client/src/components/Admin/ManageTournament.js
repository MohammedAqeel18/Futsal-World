import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import TournamentBracket from './TournamentBracket'; // Import TournamentBracket component

const ManageTournament = () => {
    const [footballRegistrationOpen, setFootballRegistrationOpen] = useState(false);
    const [cricketRegistrationOpen, setCricketRegistrationOpen] = useState(false);
    const [footballTournamentDate, setFootballTournamentDate] = useState('');
    const [footballDeadline, setFootballDeadline] = useState('');
    const [cricketTournamentDate, setCricketTournamentDate] = useState('');
    const [cricketDeadline, setCricketDeadline] = useState('');
    const [registeredFootballTeams, setRegisteredFootballTeams] = useState([]);
    const [registeredCricketTeams, setRegisteredCricketTeams] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [footballBracket, setFootballBracket] = useState(null);
    const [cricketBracket, setCricketBracket] = useState(null);

    // Get today's date in the format 'YYYY-MM-DD'
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchTournamentSettings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/tournament/admin-settings', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                });
                const data = res.data;
                setFootballRegistrationOpen(data.footballRegistrationOpen);
                setCricketRegistrationOpen(data.cricketRegistrationOpen);
                setFootballTournamentDate(data.footballTournamentDate);
                setFootballDeadline(data.footballDeadline);
                setCricketTournamentDate(data.cricketTournamentDate);
                setCricketDeadline(data.cricketDeadline);
            } catch (err) {
                setError('Error fetching tournament settings.');
                console.error(err);
            }
        };

        const fetchRegisteredTeams = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/tournament/registered-teams', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                });
                const data = res.data;
                setRegisteredFootballTeams(data.footballTeams);
                setRegisteredCricketTeams(data.cricketTeams);
            } catch (err) {
                setError('Error fetching registered teams.');
                console.error(err);
            }
        };

        fetchTournamentSettings();
        fetchRegisteredTeams();
    }, []);

    const handleSaveSettings = async () => {
        try {
            await axios.post('http://localhost:5000/api/tournament/admin-settings', {
                footballRegistrationOpen,
                cricketRegistrationOpen,
                footballTournamentDate,
                footballDeadline,
                cricketTournamentDate,
                cricketDeadline
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setMessage('Tournament settings updated successfully!');
        } catch (err) {
            setError('Failed to save settings.');
            console.error(err);
        }
    };

    const handleRemoveTeam = async (teamId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tournament/remove-team/${teamId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setRegisteredFootballTeams((teams) => teams.filter((team) => team._id !== teamId));
            setRegisteredCricketTeams((teams) => teams.filter((team) => team._id !== teamId));
            setMessage('Team removed successfully!');
        } catch (err) {
            setError('Failed to remove team.');
            console.error(err);
        }
    };

    const handleGenerateFootballBracket = async () => {
        try {
            const res = await axios.post(
                'http://localhost:5000/api/tournament/generate-bracket',
                { sport: 'Football' },
                { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
            );
            setFootballBracket(res.data.bracket);  // Set football bracket in the state
            setMessage('Football bracket generated successfully!');
        } catch (err) {
            setError('Failed to generate football bracket.');
            console.error(err);
        }
    };

    const handleGenerateCricketBracket = async () => {
        try {
            const res = await axios.post(
                'http://localhost:5000/api/tournament/generate-bracket',
                { sport: 'Cricket' },
                { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
            );
            setCricketBracket(res.data.bracket);  // Set cricket bracket in the state
            setMessage('Cricket bracket generated successfully!');
        } catch (err) {
            setError('Failed to generate cricket bracket.');
            console.error(err);
        }
    };
    
    const handleCloseRegistrationAndEnableBracket = async () => {
        try {
            await axios.post('http://localhost:5000/api/tournament/close-registration', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
            });
            setMessage('Registration closed, and the bracket is now visible to users!');
        } catch (err) {
            setError('Failed to close registration and enable bracket visibility.');
            console.error(err);
        }
    };

    return (
        <Container>
            <Box mt={4}>
                <Typography variant="h5">Manage Tournaments</Typography>

                {/* Football Tournament Management */}
                <Box mt={2}>
                    <Typography variant="h6">Football Tournament</Typography>
                    <TextField
                        label="Tournament Date"
                        type="date"
                        value={footballTournamentDate}
                        onChange={(e) => setFootballTournamentDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today }}  
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Registration Deadline"
                        type="date"
                        value={footballDeadline}
                        onChange={(e) => setFootballDeadline(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today }}  
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant={footballRegistrationOpen ? 'contained' : 'outlined'}
                        color={footballRegistrationOpen ? 'primary' : 'secondary'}
                        onClick={() => setFootballRegistrationOpen(!footballRegistrationOpen)}
                    >
                        {footballRegistrationOpen ? 'Disable' : 'Enable'} Football Registration
                    </Button>

                    {/* Registered Football Teams */}
                    <Typography variant="h6" mt={4}>Registered Football Teams</Typography>
                    <List>
                        {registeredFootballTeams.map((team) => (
                            <ListItem key={team._id}>
                                <ListItemText primary={`${team.teamName} - Captain: ${team.coachName}`} />
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTeam(team._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>

                    {/* Generate Bracket Button for Football */}
                    <Button variant="contained" color="primary" onClick={handleGenerateFootballBracket} sx={{ mt: 2 }}>
                        Generate Football Bracket
                    </Button>

                    {/* Display Football Bracket */}
                    <TournamentBracket sport="Football" bracket={footballBracket} />
                </Box>

                {/* Cricket Tournament Management */}
                <Box mt={4}>
                    <Typography variant="h6">Cricket Tournament</Typography>
                    <TextField
                        label="Tournament Date"
                        type="date"
                        value={cricketTournamentDate}
                        onChange={(e) => setCricketTournamentDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today }}  
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Registration Deadline"
                        type="date"
                        value={cricketDeadline}
                        onChange={(e) => setCricketDeadline(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today }}  
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant={cricketRegistrationOpen ? 'contained' : 'outlined'}
                        color={cricketRegistrationOpen ? 'primary' : 'secondary'}
                        onClick={() => setCricketRegistrationOpen(!cricketRegistrationOpen)}
                    >
                        {cricketRegistrationOpen ? 'Disable' : 'Enable'} Cricket Registration
                    </Button>

                    {/* Registered Cricket Teams */}
                    <Typography variant="h6" mt={4}>Registered Cricket Teams</Typography>
                    <List>
                        {registeredCricketTeams.map((team) => (
                            <ListItem key={team._id}>
                                <ListItemText primary={`${team.teamName} - Captain: ${team.coachName}`} />
                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTeam(team._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>

                    {/* Generate Bracket Button for Cricket */}
                    <Button variant="contained" color="primary" onClick={handleGenerateCricketBracket} sx={{ mt: 2 }}>
                        Generate Cricket Bracket
                    </Button>

                    {/* Display Cricket Bracket */}
                    <TournamentBracket sport="Cricket" bracket={cricketBracket} />
                </Box>
                
                {/* Save Button */}
                <Box mt={4}>
                    <Button variant="contained" color="primary" onClick={handleSaveSettings}>
                        Save Settings
                    </Button>
                </Box>

                {/* Close Registration and Enable Bracket Button */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCloseRegistrationAndEnableBracket}
                    sx={{ mt: 2 }}
                >
                    Close Registration and Enable Bracket
                </Button>

                {/* Display error or success message */}
                {error && <Typography color="error">{error}</Typography>}
                {message && <Typography color="primary">{message}</Typography>}
            </Box>
        </Container>
    );
};

export default ManageTournament;
