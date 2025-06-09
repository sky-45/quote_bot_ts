import { Schema } from 'mongoose';
import { connectionMongoDB } from '../../connections/mongodbConnection';
const QuoteSchema = new Schema({
    quote: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, { timestamps: true });
const QuoteModel = connectionMongoDB.model('Quote', QuoteSchema);
export { QuoteModel };
