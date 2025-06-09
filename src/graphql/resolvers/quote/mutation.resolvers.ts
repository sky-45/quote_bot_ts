import { createQuote } from '../../../datalayer/actuators/quote/index.js';
import { MutationResolvers } from '../../__generated__/types.js';

export const Mutation:MutationResolvers = {
  createQuote: async (_, input, { dataSources }) => {
    console.log('createQuote resolver called with input:', input);

    const newQuote = await createQuote(input);

    if (!newQuote) {
      throw new Error('Failed to create quote');
    }
    
    return newQuote;
  }
};

