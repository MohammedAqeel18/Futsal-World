import React, { useState, useEffect } from 'react';
import { Bracket, Seed, SeedItem, SeedTeam } from 'react-brackets';
import axios from 'axios';
import { Button } from '@mui/material';

const TournamentBracket = ({ sport, bracket }) => {
    const [updatedBracket, setUpdatedBracket] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (bracket) {
            setUpdatedBracket(bracket);
        }
    }, [bracket]);

    // Handle selecting or unselecting the winner for each match
    const handleSelectWinner = (roundIndex, matchIndex, winner) => {
        const newBracket = [...updatedBracket];
        const match = newBracket[roundIndex][matchIndex];
    
        // Determine the loser based on the winner selection
        const loser = winner === 'team1' ? 'team2' : 'team1';
    
        // Set the winner and loser
        match.winner = winner;
        match.loser = loser;
    
        // Check if the current round is complete (all matches have winners)
        const isRoundComplete = newBracket[roundIndex].every((m) => m.winner !== null);
    
        // If the round is complete, generate the next round or declare a champion
        if (isRoundComplete && roundIndex === newBracket.length - 1) {
            generateNextRound(newBracket, roundIndex);
        }
    
        setUpdatedBracket(newBracket);
    };
    
    // Generate the next round based on the winners of the current round
    const generateNextRound = (bracket, currentRoundIndex) => {
        const winners = bracket[currentRoundIndex].map((match) => match[match.winner]);
    
        // If only two teams remain, create the final match and declare the winner as champion
        if (winners.length === 2) {
            const finalRound = [{ team1: winners[0], team2: winners[1], winner: null }];
            setUpdatedBracket([...bracket, finalRound]);
        } else if (winners.length > 2) {
            // Generate the next round by pairing winners
            const nextRound = [];
            for (let i = 0; i < winners.length; i += 2) {
                nextRound.push({
                    team1: winners[i],
                    team2: winners[i + 1] || null,  // Handle odd number of teams
                    winner: null,
                });
            }
            setUpdatedBracket([...bracket, nextRound]);
        } else if (winners.length === 1) {
            // If only one team remains, declare them as the champion
            setMessage(`Champion: ${winners[0].teamName}`);
        }
    };
    

    // Handle saving the bracket to the server
    const handleSaveBracket = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            console.log('Saving bracket with winners and losers:', updatedBracket);
    
            await axios.post(
                `http://localhost:5000/api/tournament/${sport}/update-bracket`,
                { sport, bracket: updatedBracket },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setMessage('Bracket updated successfully!');
            
            // Check if all matches in the current round have winners
            const currentRoundIndex = updatedBracket.length - 1;
            const isRoundComplete = updatedBracket[currentRoundIndex].every(match => match.winner !== null);
    
            // If the current round is complete, generate the next round
            if (isRoundComplete) {
                generateNextRound(updatedBracket, currentRoundIndex);
            }
        } catch (err) {
            console.error('Error saving bracket:', err.response ? err.response.data : err);
            setError('Failed to save the bracket.');
        }
    };
    
    

    // Render the bracket structure
    const renderBracket = () => (
        <div style={styles.bracketContainer}>
            {updatedBracket.map((round, roundIndex) => (
                <div style={styles.roundContainer} key={roundIndex}>
                    <h3>Round {roundIndex + 1}</h3>
                    {round.map((match, matchIndex) => (
                        <div style={styles.matchContainer} key={matchIndex}>
                            <Seed>
                                <SeedItem>
                                    <SeedTeam
                                        onClick={() => handleSelectWinner(roundIndex, matchIndex, 'team1')}
                                        style={{
                                            ...styles.seedTeam,
                                            backgroundColor: match.winner === 'team1' ? '#27ae60' : '#34495e',
                                        }}
                                    >
                                        {match.team1 ? match.team1.teamName : 'TBD'}
                                    </SeedTeam>
                                    <SeedTeam
                                        onClick={() => handleSelectWinner(roundIndex, matchIndex, 'team2')}
                                        style={{
                                            ...styles.seedTeam,
                                            backgroundColor: match.winner === 'team2' ? '#27ae60' : '#34495e',
                                        }}
                                    >
                                        {match.team2 ? match.team2.teamName : 'TBD'}
                                    </SeedTeam>
                                </SeedItem>
                            </Seed>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ marginTop: '20px' }}>
            <h2>{sport} Bracket</h2>
            {updatedBracket.length > 0 ? (
                <div>
                    {renderBracket()}
                    <Button variant="contained" color="primary" onClick={handleSaveBracket}>
                        Save Bracket
                    </Button>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <p>No bracket data available.</p>
            )}
        </div>
    );
};

// Styles for rendering the bracket
const styles = {
    bracketContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '50px',
        marginTop: '20px',
    },
    roundContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    matchContainer: {
        position: 'relative',
        padding: '5px 15px',
        backgroundColor: '#2c3e50',
        borderRadius: '5px',
        color: '#fff',
        fontSize: '16px',
    },
    seedTeam: {
        cursor: 'pointer',
        padding: '10px',
        backgroundColor: '#34495e',
        color: '#ecf0f1',
        borderRadius: '4px',
        textAlign: 'center',
        marginBottom: '5px',
        width: '150px',
    },
};

export default TournamentBracket;
