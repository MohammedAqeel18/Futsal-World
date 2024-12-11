module.exports = {
    //mongoURI: 'mongodb+srv://sammaworks:v9fNjJ61Ficsikpw@futsaldb.hnqer3d.mongodb.net/?retryWrites=true&w=majority&appName=futsaldb',
   // secretOrKey: 'secret',
    adminUsername: 'admin', 
    adminPassword: 'admin123', 
    secretOrKey: process.env.JWT_SECRET || 'sk_test_51PPc3URrD4b010W800jFpYrGAjkdXurldHbVEs6kC6tAe4ascPwtwzjiXBhAo210X47DfIpVh75mqE7MXrIjGXH300hLF68cfz',
    mongoURI: process.env.MONGO_URI || 'mongodb+srv://sammaworks:v9fNjJ61Ficsikpw@futsaldb.hnqer3d.mongodb.net/?retryWrites=true&w=majority&appName=futsaldb',
};

// v9fNjJ61Ficsikpw