import { Schema } from 'mongoose';
import { connectionMongoDB } from '../../connections/mongodbConnection';
const ChannelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    addedBy: {
        type: String,
        required: true
    }
}, { timestamps: true });
const ChannelModel = connectionMongoDB.model('Channel', ChannelSchema);
export default ChannelModel;
