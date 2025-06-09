import { Schema } from 'mongoose';
import { connectionMongoDB } from '../../connections/mongodbConnection';
const BirthdaySchema = new Schema({
    user: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    addedBy: {
        type: String,
        required: true
    }
}, { timestamps: true });
const BirthdayModel = connectionMongoDB.model('Birthday', BirthdaySchema);
export default BirthdayModel;
