const Tournament = require('../models/Tournament');
const nodemailer = require('nodemailer');
const stripe = require('stripe')('sk_test_51PPc3URrD4b010W800jFpYrGAjkdXurldHbVEs6kC6tAe4ascPwtwzjiXBhAo210X47DfIpVh75mqE7MXrIjGXH300hLF68cfz');
const QRCode = require('qrcode');
const path = require('path');
const TournamentSettings = require('../models/TournamentSettings'); // Import the new modelnpm
const Bracket = require('../models/Bracket'); // Assuming you have a Bracket model

// Register Team
exports.registerTeam = async (req, res) => {
    const { teamName, coachName, members } = req.body;
    try {
        const newTournament = new Tournament({
            teamName,
            coachName,
            members,
            user: req.user.id,
        });
        await newTournament.save();
        res.status(201).json({ message: 'Team registered successfully', tournament: newTournament });
    } catch (error) {
        res.status(500).json({ message: 'Error registering team', error });
    }
};

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment intent', error });
    }
};

// Send QR Code via Email
exports.sendQrCode = async (req, res) => {
    const { paymentIntentId, email, teamName } = req.body;
    try {
        const qrCodeUrl = await QRCode.toDataURL(paymentIntentId);
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'velva95@ethereal.email',
                pass: 'VkD4HqYqKSJnsjnQS2'
            },
        });

        const mailOptions = {
            from: 'no-reply@futsalworld.com',
            to: email,
            subject: 'Tournament Registration Confirmation',
            text: `Your team ${teamName} has been successfully registered for the tournament. Please find the QR code attached.`,
            attachments: [
                {
                    filename: 'qrcode.png',
                    path: qrCodeUrl,
                },
            ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error });
            }
            res.status(200).json({ message: 'Email sent successfully', info });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating QR code', error });
    }
};



// Fetch Available Tournaments
exports.getAvailableTournaments = async (req, res) => {
    const tournaments = [
        {
            id: 1,
            name: "Cricket Tournament (Saturdays)",
            date: "2024-07-10",
            info: "Join the Cricket Tournament and compete against the best teams in the region.",
            imageUrl: '/background.jpg'
        },
        {
            id: 2,
            name: "Football Tournament (Sundays)",
            date: "2024-08-15",
            info: "Register for the Football Tournament and showcase your skills.",
            imageUrl: "/futsal-crest-png.webp"
        },
    ];
    res.status(200).json(tournaments);
};
// Get tournament settings (admin)
exports.getAdminTournamentSettings = async (req, res) => {
    try {
        const settings = await TournamentSettings.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournament settings', error });
    }
};

// Update tournament settings (admin)
exports.updateAdminTournamentSettings = async (req, res) => {
    const { footballRegistrationOpen, cricketRegistrationOpen, footballTournamentDate, footballDeadline, cricketTournamentDate, cricketDeadline } = req.body;

    try {
        let settings = await TournamentSettings.findOne();
        if (!settings) {
            settings = new TournamentSettings({});
        }

        settings.footballRegistrationOpen = footballRegistrationOpen;
        settings.cricketRegistrationOpen = cricketRegistrationOpen;
        settings.footballTournamentDate = footballTournamentDate;
        settings.footballDeadline = footballDeadline;
        settings.cricketTournamentDate = cricketTournamentDate;
        settings.cricketDeadline = cricketDeadline;

        await settings.save();
        res.json({ message: 'Tournament settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating tournament settings', error });
    }
};

exports.removeTeam = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        await Tournament.findByIdAndDelete(teamId);
        res.status(200).json({ message: 'Team removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing team', error });
    }
};
// Generate Tournament Bracket
exports.generateBracket = async (req, res) => {
    const { sport } = req.body;

    try {
        const teams = await Tournament.find({ sport });
        console.log(`Fetched ${teams.length} teams for sport: ${sport}`);

        if (teams.length < 2) {
            return res.status(400).json({ message: 'Not enough teams registered to generate a bracket.' });
        }

        const shuffledTeams = teams.sort(() => 0.5 - Math.random());

        // Create the first round
        const firstRound = [];
        for (let i = 0; i < shuffledTeams.length; i += 2) {
            const match = {
                team1: shuffledTeams[i],
                team2: shuffledTeams[i + 1] || null,  // Handle odd number of teams
                winner: null,
                loser: null,  // Store loser as well
            };
            firstRound.push(match);
        }

        const bracket = [firstRound];
        let existingBracket = await Bracket.findOne({ sport });
        if (!existingBracket) {
            existingBracket = new Bracket({ sport, structure: bracket });
        } else {
            existingBracket.structure = bracket;
        }

        await existingBracket.save();
        console.log('Generated Bracket:', JSON.stringify(existingBracket.structure, null, 2));
        res.status(200).json({ bracket: existingBracket.structure });
    } catch (err) {
        console.error('Error generating bracket:', err);
        res.status(500).json({ message: 'Error generating bracket', error: err });
    }
};





// Save tournament settings (alias for updateAdminTournamentSettings)
exports.saveTournamentSettings = async (req, res) => {
    const { footballRegistrationOpen, cricketRegistrationOpen, footballTournamentDate, footballDeadline, cricketTournamentDate, cricketDeadline } = req.body;

    try {
        let settings = await TournamentSettings.findOne();
        if (!settings) {
            settings = new TournamentSettings({});
        }

        settings.footballRegistrationOpen = footballRegistrationOpen;
        settings.cricketRegistrationOpen = cricketRegistrationOpen;
        settings.footballTournamentDate = footballTournamentDate;
        settings.footballDeadline = footballDeadline;
        settings.cricketTournamentDate = cricketTournamentDate;
        settings.cricketDeadline = cricketDeadline;

        await settings.save();
        res.json({ message: 'Tournament settings saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving tournament settings', error });
    }
};
// Register Team
exports.registerTeam = async (req, res) => {
    const { teamName, teamCaptain, playersCount, substitutesCount, sport, tournamentDate } = req.body;

    try {
        // Check if the user has already registered for this sport on the same tournament date
        const existingTeam = await Tournament.findOne({
            user: req.user.id,
            sport: sport,
            tournamentDate: tournamentDate  // Ensure the same date
        });

        if (existingTeam) {
            return res.status(400).json({ message: 'You have already registered a team for this sport and date.' });
        }

        // If no existing team, proceed with registration
        const newTournament = new Tournament({
            teamName,
            coachName: teamCaptain,  // Storing captain as coachName
            members: `Players: ${playersCount}, Substitutes: ${substitutesCount}`,
            sport,
            tournamentDate,  // Add tournamentDate to the registration
            user: req.user.id,
        });
        await newTournament.save();
        res.status(201).json({ message: 'Team registered successfully!', tournament: newTournament });
    } catch (error) {
        console.error('Error registering team:', error);
        res.status(500).json({ message: 'Error registering team', error });
    }
};



// Fetch Registered Teams
exports.getRegisteredTeams = async (req, res) => {
    try {
        const footballTeams = await Tournament.find({ sport: 'Football' });
        const cricketTeams = await Tournament.find({ sport: 'Cricket' });
        res.status(200).json({ footballTeams, cricketTeams });
    } catch (error) {
        console.error('Error fetching registered teams:', error);
        res.status(500).json({ message: 'Error fetching registered teams', error });
    }
};

// Advance team in the bracket
exports.advanceTeam = async (req, res) => {
    const { matchId, winningTeamId } = req.body;

    try {
        // Find the match
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        // Set the winner for the current match
        match.winningTeam = winningTeamId;

        // Move the winning team to the next round
        const nextMatch = await Match.findById(match.nextMatchId);
        if (nextMatch) {
            if (!nextMatch.team1) {
                nextMatch.team1 = winningTeamId;
            } else {
                nextMatch.team2 = winningTeamId;
            }
            await nextMatch.save();
        }

        await match.save();
        res.status(200).json({ message: 'Team advanced successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error advancing team', error });
    }
};
// Fetch bracket data based on sport
exports.getBracket = async (req, res) => {
    const { sport } = req.params;
    try {
        const teams = await Tournament.find({ sport });

        // Log fetched teams to ensure they are being retrieved correctly
        console.log(`Fetched ${teams.length} teams for sport: ${sport}`);

        if (teams.length < 2) {
            return res.status(400).json({ message: 'Not enough teams to generate a bracket.' });
        }

        // Shuffle and generate the bracket
        const bracket = [];
        const shuffledTeams = teams.sort(() => 0.5 - Math.random());

        for (let i = 0; i < shuffledTeams.length; i += 2) {
            const match = {
                team1: shuffledTeams[i],
                team2: shuffledTeams[i + 1] || null, // Handle odd number of teams
            };
            bracket.push([match]);  // Group matches into rounds
        }

        res.status(200).json({ bracket });
    } catch (error) {
        console.error('Error fetching bracket:', error);
        res.status(500).json({ message: 'Error fetching bracket', error });
    }
};

// Update bracket data (admin)
exports.updateBracket = async (req, res) => {
    const { sport, bracket } = req.body;

    try {
        let existingBracket = await Bracket.findOne({ sport });

        if (!existingBracket) {
            return res.status(404).json({ message: 'Bracket not found for this sport.' });
        }

        console.log('Updating bracket:', bracket);

        existingBracket.structure = bracket.map(round =>
            round.map(match => ({
                team1: match.team1 || null,
                team2: match.team2 || null,
                winner: match.winner || null,
                loser: match.loser || null,  // Save loser information
            }))
        );

        await existingBracket.save();
        res.status(200).json({ message: 'Bracket updated successfully!' });
    } catch (error) {
        console.error('Error updating bracket:', error);
        res.status(500).json({ message: 'Error updating bracket.', error });
    }
};




function generateNextRound(bracket) {
    const nextRound = [];

    // Loop through each match in the current round
    for (let i = 0; i < bracket.length; i++) {
        const round = bracket[i];
        const winners = [];

        // Collect winners from the current round
        round.forEach((match) => {
            if (match.winner === 'team1') {
                winners.push(match.team1);
            } else if (match.winner === 'team2') {
                winners.push(match.team2);
            }
        });

        // Pair up winners for the next round
        const nextRoundMatches = [];
        for (let j = 0; j < winners.length; j += 2) {
            const match = {
                team1: winners[j],
                team2: winners[j + 1] || null, // Handle odd number of teams
            };
            nextRoundMatches.push(match);
        }

        nextRound.push(nextRoundMatches);

        // If there's only one match left in the next round, the tournament is over
        if (nextRoundMatches.length === 1) {
            break;
        }
    }

    return nextRound;
}
exports.closeRegistrationAndEnableBracket = async (req, res) => {
    try {
        let settings = await TournamentSettings.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        settings.isRegistrationClosed = true;
        settings.isBracketVisible = true;  // Enable the bracket to be visible to users
        await settings.save();

        res.json({ message: 'Registration closed, bracket is now visible to users.' });
    } catch (error) {
        console.error('Error updating tournament settings:', error);
        res.status(500).json({ message: 'Error updating tournament settings.', error });
    }
};
