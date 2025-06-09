import mongoose from 'mongoose';
import 'dotenv/config';
const url = process.env.MONGO_CONNECTION;
const connectionMongoDB = mongoose.createConnection(url, {
    socketTimeoutMS: 0
});
connectionMongoDB.on('connected', function () {
    console.log('MongoDB connected!');
});
connectionMongoDB.once('open', function () {
    console.log('MongoDB connection opened!');
});
connectionMongoDB.on('disconnected', () => {
    console.log('connection disconnected');
});
export { connectionMongoDB };
