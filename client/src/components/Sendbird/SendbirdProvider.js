// client/src/components/Sendbird/SendbirdProvider.js

import React from 'react';
import { SendBirdProvider } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';

const APP_ID = '6ECD349E-09A9-4875-9F1A-A1AD05F359E0'; // Replace with your Sendbird application ID

const SendbirdProvider = ({ children, userId, nickname }) => {
    return (
        <SendBirdProvider
            appId={APP_ID}
            userId={userId}
            nickname={nickname}
        >
            {children}
        </SendBirdProvider>
    );
};

export default SendbirdProvider;
