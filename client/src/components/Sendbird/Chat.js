// client/src/components/Sendbird/Chat.js

import React from 'react';
import { ChannelList, Channel, ChannelSettings } from '@sendbird/uikit-react';

const Chat = ({ userId }) => {
    const [currentChannelUrl, setCurrentChannelUrl] = React.useState(null);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '300px' }}>
                <ChannelList onChannelSelect={(channel) => setCurrentChannelUrl(channel.url)} />
            </div>
            <div style={{ flex: 1 }}>
                {currentChannelUrl ? (
                    <Channel channelUrl={currentChannelUrl} />
                ) : (
                    <div>Select a channel to start chatting</div>
                )}
            </div>
            {currentChannelUrl && (
                <div style={{ width: '300px' }}>
                    <ChannelSettings channelUrl={currentChannelUrl} />
                </div>
            )}
        </div>
    );
};

export default Chat;
