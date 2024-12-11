    // client/src/App.js

    import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
    import CssBaseline from '@mui/material/CssBaseline';
    import { ThemeProvider, createTheme } from '@mui/material/styles';
    import Home from './pages/Home';
    import NotFound from './pages/NotFound';
    import Login from './components/Auth/Login';
    import Register from './components/Auth/Register';
    import Recover from './components/Auth/Recover';
    import Profile from './components/Profile/Profile';
    import ChangePassword from './components/Profile/ChangePassword';
    import BookingForm from './components/Booking/BookingForm';
    import TournamentRegistrationForm from './components/Tournament/TournamentRegistrationPage';
    import ReviewForm from './components/Review/ReviewForm';
    import ReviewList from './components/Review/ReviewList';
    import PasswordReset from './pages/PasswordReset';
    import MatchmakingForm from './components/Matchmaking/MatchmakingForm';
    import AdminLogin from './components/Admin/AdminLogin';
    import AdminPanel from './components/Admin/AdminPanel';
    import SendbirdProvider from './components/Sendbird/SendbirdProvider';
    import Chat from './components/Sendbird/Chat';
    import ReviewPage from './components/Review/ReviewPage';
    import TournamentRegistrationPage from './components/Tournament/TournamentRegistrationPage';


    const theme = createTheme();

    const PrivateRoute = ({ children }) => {
        const token = localStorage.getItem('token');
        return token ? children : <Navigate to="/login" />;
    };

    const AdminRoute = ({ children }) => {
        const adminToken = localStorage.getItem('adminToken');
        return adminToken ? children : <Navigate to="/admin-login" />;
    };
    

    const App = () => {
        const [user, setUser] = useState(null);

        useEffect(() => {
            const fetchUser = async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const res = await fetch('http://localhost:5000/api/auth/profile', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const userData = await res.json();
                        setUser(userData);
                    } catch (err) {
                        console.error('Error fetching user data:', err);
                    }
                }
            };

            fetchUser();
        }, []);

        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <SendbirdProvider userId={user?._id} nickname={user?.firstName}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/recover" element={<Recover />} />
                            <Route path="/reset/:token" element={<PasswordReset />} />
                            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                            <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
                            <Route path="/booking" element={<PrivateRoute><BookingForm /></PrivateRoute>} />
                            <Route path="/matchmaking" element={<PrivateRoute><MatchmakingForm /></PrivateRoute>} />
                            <Route path="/tournament" element={<PrivateRoute><TournamentRegistrationForm /></PrivateRoute>} />
                            <Route path="/tournament" element={<TournamentRegistrationPage />} />
                            
                            <Route path="/reviews" element={<PrivateRoute><ReviewList /></PrivateRoute>} />
                            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                            <Route path="/messaging" element={<PrivateRoute><Chat userId={user?._id} /></PrivateRoute>} />
                            <Route path="/admin-login" element={<AdminLogin />} />
                            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                            <Route path="/review" element={<PrivateRoute><ReviewPage /></PrivateRoute>} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </SendbirdProvider>
                </Router>
            </ThemeProvider>
        );
    };

    export default App;
