import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import Navbar from '../Common/Navbar'; // Import the Navbar component
import TournamentBracket from '../Admin/TournamentBracket'; // Corrected import path

const TournamentRegistrationPage = () => {
    const [footballRegistrationOpen, setFootballRegistrationOpen] = useState(false);
    const [cricketRegistrationOpen, setCricketRegistrationOpen] = useState(false);
    const [footballTournamentDate, setFootballTournamentDate] = useState('');
    const [footballDeadline, setFootballDeadline] = useState('');
    const [cricketTournamentDate, setCricketTournamentDate] = useState('');
    const [cricketDeadline, setCricketDeadline] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teamCaptain, setTeamCaptain] = useState('');
    const [playersCount, setPlayersCount] = useState('');
    const [substitutesCount, setSubstitutesCount] = useState('');
    const [selectedSport, setSelectedSport] = useState('');
    const [registeredTeams, setRegisteredTeams] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [footballBracket, setFootballBracket] = useState(null);
    const [cricketBracket, setCricketBracket] = useState(null);

    useEffect(() => {
        const fetchTournamentSettings = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
                const res = await axios.get('http://localhost:5000/api/tournament/admin-settings', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data;
                setFootballRegistrationOpen(data.footballRegistrationOpen);
                setCricketRegistrationOpen(data.cricketRegistrationOpen);
                setFootballTournamentDate(data.footballTournamentDate);
                setFootballDeadline(data.footballDeadline);
                setCricketTournamentDate(data.cricketTournamentDate);
                setCricketDeadline(data.cricketDeadline);
            } catch (err) {
                console.error('Error fetching tournament settings:', err);
            }
        };
        fetchTournamentSettings();
    }, []);

    // Fetch registered teams
    const fetchRegisteredTeams = async (sport) => {
        try {
            const token = localStorage.getItem('token'); // Ensure token is fetched from localStorage
            if (!token) {
                throw new Error('No token found, please log in.');
            }

            const res = await axios.get('http://localhost:5000/api/tournament/registered-teams', {
                headers: { Authorization: `Bearer ${token}` },  // Add Authorization header with the token
            });

            const data = res.data;
            if (sport === 'Football') {
                setRegisteredTeams(data.footballTeams);
                setFootballBracket(data.footballBracket); // Set the football bracket
            } else if (sport === 'Cricket') {
                setRegisteredTeams(data.cricketTeams);
                setCricketBracket(data.cricketBracket); // Set the cricket bracket
            }

        } catch (err) {
            console.error('Error fetching registered teams:', err);
            setError('Failed to fetch registered teams. Please try again.');
        }
    };

    const handleRegisterTeam = async (sport) => {
        const tournamentDate = sport === 'Football' ? footballTournamentDate : cricketTournamentDate;

        try {
            await axios.post('http://localhost:5000/api/tournament/register', {
                teamName,
                teamCaptain,
                playersCount,
                substitutesCount,
                sport,
                tournamentDate  // Ensure the date is passed
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage('Team registered successfully!');
            setError('');
            fetchRegisteredTeams(sport);  // Refresh registered teams after successful registration
        } catch (err) {
            console.error('Error registering team:', err);
            setError(err.response?.data?.message || 'Failed to register team');
            setMessage('');
        }
    };


    const handleRemoveTeam = async (teamId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tournament/remove-team/${teamId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage('Team removed successfully!');
            fetchRegisteredTeams(selectedSport);  // Refresh registered teams after removal
        } catch (err) {
            console.error('Error removing team:', err);
            setError('Failed to remove team');
        }
    };

    return (
        <>
            <Navbar />
            <Container>
                <Box mt={4}>
                    <Typography variant="h5">Tournament Registration</Typography>

                    {/* Football Tournament Section */}
                    <Box mt={4}>
                        <Typography variant="h6">Football Tournament</Typography>
                        <Typography variant="body1">Tournament Date: {footballTournamentDate}</Typography>
                        <Typography variant="body1">Registration Deadline: {footballDeadline}</Typography>
                        {footballRegistrationOpen ? (
                            <Box mt={2}>
                                <Button variant="contained" color="primary" onClick={() => {
                                    setSelectedSport('Football');
                                    fetchRegisteredTeams('Football');
                                }}>
                                    Register for Football
                                </Button>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="error">
                                Football registration is currently closed.
                            </Typography>
                        )}
                    </Box>

                    {/* Cricket Tournament Section */}
                    <Box mt={4}>
                        <Typography variant="h6">Cricket Tournament</Typography>
                        <Typography variant="body1">Tournament Date: {cricketTournamentDate}</Typography>
                        <Typography variant="body1">Registration Deadline: {cricketDeadline}</Typography>
                        {cricketRegistrationOpen ? (
                            <Box mt={2}>
                                <Button variant="contained" color="primary" onClick={() => {
                                    setSelectedSport('Cricket');
                                    fetchRegisteredTeams('Cricket');
                                }}>
                                    Register for Cricket
                                </Button>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="error">
                                Cricket registration is currently closed.
                            </Typography>
                        )}
                    </Box>

                    {/* Registration Form - Appears when a sport is selected */}
                    {selectedSport && (
                        <Box mt={4}>
                            <Typography variant="h6">Register Team for {selectedSport} Tournament</Typography>
                            <TextField
                                label="Team Name"
                                fullWidth
                                margin="normal"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                            <TextField
                                label="Team Captain"
                                fullWidth
                                margin="normal"
                                value={teamCaptain}
                                onChange={(e) => setTeamCaptain(e.target.value)}
                            />
                            <TextField
                                label="Number of Players"
                                fullWidth
                                margin="normal"
                                value={playersCount}
                                onChange={(e) => setPlayersCount(e.target.value)}
                            />
                            <TextField
                                label="Number of Substitute Players"
                                fullWidth
                                margin="normal"
                                value={substitutesCount}
                                onChange={(e) => setSubstitutesCount(e.target.value)}
                            />
                            <Button variant="contained" color="primary" onClick={() => handleRegisterTeam(selectedSport)}>
                                Register Team
                            </Button>
                            {error && <Typography variant="body2" color="error">{error}</Typography>}
                            {message && <Typography variant="body2" color="primary">{message}</Typography>}
                        </Box>
                    )}

                    {/* Display Registered Teams */}
                    {registeredTeams.length > 0 && (
                        <Box mt={4}>
                            <Typography variant="h6">Registered Teams for {selectedSport}</Typography>
                            {registeredTeams.map((team) => (
                                <Box key={team._id} mt={2} p={2} border="1px solid #ccc" borderRadius="4px">
                                    <Typography variant="body1"><strong>Team Name:</strong> {team.teamName}</Typography>
                                    <Typography variant="body1"><strong>Captain:</strong> {team.coachName}</Typography>
                                    <Typography variant="body1"><strong>Members:</strong> {team.members}</Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleRemoveTeam(team._id)}
                                    >
                                        Remove Team
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Display Brackets */}
                    {selectedSport === 'Football' && footballBracket && (
                        <Box mt={4}>
                            <Typography variant="h6">Football Tournament Bracket</Typography>
                            <TournamentBracket sport="Football" bracket={footballBracket} />
                        </Box>
                    )}
                    {selectedSport === 'Cricket' && cricketBracket && (
                        <Box mt={4}>
                            <Typography variant="h6">Cricket Tournament Bracket</Typography>
                            <TournamentBracket sport="Cricket" bracket={cricketBracket} />
                        </Box>
                    )}

                </Box>
            </Container>
        </>
    );
};

export default TournamentRegistrationPage;
