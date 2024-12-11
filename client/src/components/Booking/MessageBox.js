import React, { forwardRef } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';  // Import Close icon

const MessageBox = forwardRef(({ messageContent, setMessageContent, sendMessage, messages, bookingUserId, currentUserId, onClose }, ref) => {
    return (
        <Box ref={ref} sx={{ ...modalStyle }}>
            {/* Close Button */}
            <IconButton
                aria-label="close"
                onClick={onClose}  // Call the onClose function when clicked
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            <Typography variant="h6" component="h2">
                Messages
            </Typography>

            {/* Display Previous Messages */}
            {messages && messages.length > 0 ? (
                <Box sx={{ maxHeight: 200, overflowY: 'scroll' }}>
                    {messages.map((msg, index) => (
                        <Typography
                            key={index}
                            variant="body2"
                            style={{
                                fontWeight: msg.sender._id === bookingUserId ? 'bold' : 'normal',
                                color: msg.sender._id === bookingUserId ? '#4caf50' : '#000'  // Different color for booking user
                            }}
                        >
                            {msg.sender.username || msg.sender._id}: {msg.content}
                        </Typography>
                    ))}
                </Box>
            ) : (
                <Typography variant="body2">No messages yet.</Typography>
            )}

            <TextField
                fullWidth
                variant="outlined"
                label="Your Message"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                multiline
                rows={4}
                sx={{ mt: 2 }}
            />
            <Button variant="contained" color="primary" onClick={sendMessage} sx={{ mt: 2 }}>
                Send
            </Button>
        </Box>
    );
});

export default MessageBox;

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
