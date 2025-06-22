import axios from 'axios';
import { Error } from 'mongoose';
import RedisController from '../redis';
import ChannelModel from '../../models/Channel';
import { getCurrentTime } from '../../../utils';
const { CLIENT_ID, CLIENT_SECRET } = process.env;
export const getAccessToken = async () => {
    try {
        let access_token = await RedisController.getRedis('bearer');
        if (access_token)
            return access_token;
        access_token = await updateAccessToken();
        return access_token;
    }
    catch (error) {
        console.log('error', error);
        throw new Error(error);
    }
};
export const updateAccessToken = async () => {
    try {
        const { data: { access_token, expires_in } } = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        });
        await RedisController.setRedis({ key: 'bearer', value: access_token, delay: expires_in });
        return access_token;
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error TwitchController-updateAccessToken:`, error?.message);
    }
};
export const getChannel = async (channel, live_only = false) => {
    try {
        const access_token = await getAccessToken();
        const { data: { data: streams = [] } } = await axios.get('https://api.twitch.tv/helix/search/channels', {
            headers: {
                'client-id': CLIENT_ID,
                'Authorization': `Bearer ${access_token}`
            },
            params: {
                query: channel,
                live_only,
                first: 1
            }
        });
        if (streams.length == 0)
            throw new Error('Canal no encontrado');
        const { broadcaster_login, is_live } = streams[0];
        return {
            channelName: broadcaster_login,
            is_live
        };
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error TwitchController-getChannel:`, error?.message);
    }
};
export const getChannels = async (channels, live_only = false) => {
    try {
        const access_token = await getAccessToken();
        const live_info_channels = await Promise.all(channels.map((channel) => {
            return axios.get('https://api.twitch.tv/helix/search/channels', {
                headers: {
                    'client-id': CLIENT_ID,
                    'Authorization': `Bearer ${access_token}`
                },
                params: {
                    query: channel,
                    live_only,
                    first: 1
                }
            });
        }));
        const channels_status = live_info_channels.map((channel_info) => {
            const { data: { data: streams = [] } } = channel_info;
            if (streams.length == 0)
                return false;
            return {
                channelName: streams[0].broadcaster_login,
                is_live: streams[0].is_live
            };
        });
        return channels_status.filter((el) => el !== false);
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error TwitchController-getChannels:`, error?.message);
        return [];
    }
};
export const addChannel = async (query, addedBy) => {
    try {
        const [{ channelName } = {}] = await getChannels([query]);
        const existingChannels = await getFollowedChannels();
        const exists = existingChannels?.filter(el => el.name == query) || [];
        if (channelName != query)
            return 'Escribe bien el canal monse !';
        if (exists.length > 0)
            return 'El canal ya existe monse !';
        await ChannelModel.create({
            name: channelName,
            addedBy
        });
        return 'Canal ' + query + ' añadido correctamente !';
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error TwitchController-addChannel:`, error);
    }
};
export const getFollowedChannels = async () => {
    try {
        const followedChannels = await ChannelModel.find().lean();
        return followedChannels;
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error TwitchController-getFollowedChannels:`, error);
    }
};
export const getLiveChannels = async () => {
    try {
        const followedChannels = await getFollowedChannels() || [];
        const liveChannels = [];
        for (const followChannel of followedChannels) {
            const [{ is_live } = {}] = await getChannels([followChannel.name]);
            liveChannels.push({
                name: followChannel.name,
                status: is_live ? 'ONLINE' : 'OFFLINE'
            });
        }
        return liveChannels;
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error TwitchController-getLiveChannels:`, error);
        return [];
    }
};
// 1. apagado -> prendido: stado redis = ON & notification
// 2. prendido -> prendido: stado redis = ON -> bypass notification
// 3. apagado -> prendido: stado redis = OFF
export const notifyChannelsLive = async (channels = [], chat) => {
    try {
        const channelsPendingNotify = [];
        for (const chann of channels) {
            if (chann.status == 'ONLINE') {
                const isNotified = await RedisController.getRedis(`Notified-${chann.name}`);
                if (!isNotified) {
                    channelsPendingNotify.push(chann);
                    await RedisController.setRedis({ key: `Notified-${chann.name}`, value: 'true', delay: 60 * 60 * 24 });
                }
            }
            else {
                await RedisController.deleteRedis(chann.name);
            }
        }
        for (const livechannel of channelsPendingNotify) {
            await chat.send({
                content: '@everyone  Monses ' + livechannel + ' esta en vivo: https://twitch.tv/' + livechannel + ' !'
            }).catch((err) => {
                console.error(err);
            });
        }
    }
    catch (error) {
        console.log(`[${getCurrentTime()}] Error TwitchController-notifyChannelsLive:`, error);
        return [];
    }
};
