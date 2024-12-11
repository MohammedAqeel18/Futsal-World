import axios from 'axios';

const API_URL = 'http://localhost:5000/api/message';

// Send a message
export const sendMessage = async (data) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return await axios.post(`${API_URL}/send`, data, config);
};

// Get messages for a booking
export const getMessages = async (bookingId) => {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { bookingId }
    };
    return await axios.get(`${API_URL}/inbox`, config);
};
