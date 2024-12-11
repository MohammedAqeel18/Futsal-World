const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const matchmakingRoutes = require('./routes/matchmaking');
const matchmakingMessageRoutes = require('./routes/matchmakingMessage'); // Import MatchmakingMessage routes
const tournamentRoutes = require('./routes/tournament');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/review');
const adminRoutes = require('./routes/admin');
const messageRoutes = require('./routes/message');
const notificationRoutes = require('./routes/notification');
const path = require('path')
const matchRoutes = require('./routes/match');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./models/Message'); // Import the model
const users = require('./routes/users');
const passport = require('passport');
const router = express.Router();

require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Allow only the frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true // Allow credentials (cookies, tokens, etc.)
}));
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use('/api/message', messageRoutes);




app.use(express.static(path.join(__dirname, 'public')));

// MongoDB configuration
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('MongoDB Connected');
    mongoose.set('debug', true);  // Enable Mongoose debug mode here
})
    .catch(err => console.log(err));            



const multer = require('multer');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Endpoint for uploading profile image
router.post('/profile/upload', upload.single('profileImage'), (req, res) => {
    try {
        const profileImage = req.file.path;
        res.status(200).json({ message: 'Profile image uploaded successfully', profileImage });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile image', error });
    }
});

module.exports = router;



// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/matchmaking-message', matchmakingMessageRoutes); // Register Matchmaking Message routes
app.use('/api/tournament', tournamentRoutes);
app.use('/api/user', userRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/me', users);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
