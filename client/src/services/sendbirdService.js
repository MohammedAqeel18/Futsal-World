import SendBird from 'sendbird';

const APP_ID = '6ECD349E-09A9-4875-9F1A-A1AD05F359E0'; // Replace with your Sendbird application ID

let sb = null;

export const initSendbird = (userId, nickname) => {
    sb = new SendBird({ appId: APP_ID });
    return new Promise((resolve, reject) => {
        sb.connect(userId, (user, error) => {
            if (error) {
                console.error('Error connecting to Sendbird:', error);
                reject(error);
            } else {
                sb.updateCurrentUserInfo(nickname, null, (response, error) => {
                    if (error) {
                        console.error('Error updating user info:', error);
                        reject(error);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    });
};

export const createChannel = (channelName, userIds) => {
    return new Promise((resolve, reject) => {
        sb.GroupChannel.createChannelWithUserIds(userIds, true, channelName, null, null, (channel, error) => {
            if (error) {
                console.error('Error creating channel:', error);
                reject(error);
            } else {
                resolve(channel);
            }
        });
    });
};

export const getChannels = () => {
    const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    return new Promise((resolve, reject) => {
        channelListQuery.next((channels, error) => {
            if (error) {
                console.error('Error fetching channels:', error);
                reject(error);
            } else {
                resolve(channels);
            }
        });
    });
};

export const sendMessage = (channelUrl, message) => {
    return new Promise((resolve, reject) => {
        sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
            if (error) {
                console.error('Error getting channel:', error);
                reject(error);
            } else {
                channel.sendUserMessage(message, (message, error) => {
                    if (error) {
                        console.error('Error sending message:', error);
                        reject(error);
                    } else {
                        resolve(message);
                    }
                });
            }
        });
    });
};

export const receiveMessages = (channelUrl, handler) => {
    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
        if (error) {
            console.error('Error getting channel:', error);
        } else {
            channel.createPreviousMessageListQuery().load(30, true, (messages, error) => {
                if (error) {
                    console.error('Error loading messages:', error);
                } else {
                    handler(messages);
                }
            });
        }
    });

    sb.addChannelHandler(channelUrl, new sb.ChannelHandler({
        onMessageReceived: (channel, message) => {
            handler([message]);
        }
    }));
};
