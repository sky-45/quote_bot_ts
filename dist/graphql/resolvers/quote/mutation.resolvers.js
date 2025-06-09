import { createQuote } from '../../../datalayer/actuators/quote/index.js';
export const Mutation = {
    createQuote: async (_, input, { dataSources }) => {
        console.log('createQuote resolver called with input:', input);
        const newQuote = await createQuote(input);
        if (!newQuote) {
            throw new Error('Failed to create quote');
        }
        return newQuote;
    }
};
