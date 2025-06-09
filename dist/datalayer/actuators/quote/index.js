import { QuoteModel } from '../../models/Quote.js';
const getRandomQuote = async () => {
    try {
        const [randomQuote] = await QuoteModel.aggregate([{ $sample: { size: 1 } }]);
        return randomQuote;
    }
    catch (error) {
        console.log('Error getRandomQuote:', error);
        throw new Error('Failed to create quote');
    }
};
const getAllQuotes = async () => {
    try {
        const quotes = await QuoteModel.find().lean();
        console.log('Quotes fetched:', quotes[0]);
        return quotes;
    }
    catch (error) {
        console.log('Error getAllQuotes:', error);
        throw new Error('Failed to create quote');
    }
};
const createQuote = async (input) => {
    try {
        const newQuote = {
            quote: input.quote,
            author: input.author
        };
        return await QuoteModel.create(newQuote);
    }
    catch (error) {
        console.log('Error createQuote:', error);
        throw new Error('Failed to create quote');
    }
};
export { getRandomQuote, getAllQuotes, createQuote };
