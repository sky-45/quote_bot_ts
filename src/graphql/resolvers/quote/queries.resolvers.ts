
import { QueryResolvers } from '../../__generated__/types';
import {getRandomQuote, getAllQuotes} from '../../../datalayer/actuators/quote';

export const Query: QueryResolvers = {
  getQuote: async (_, {}, { dataSources }) => {
    console.log('getQuote resolver called');
    const quote = await getRandomQuote();
    if (!quote) {
      throw new Error(`Quote not found`);
    }
    return quote;
  },
  getQuotes: async (_, {}, { dataSources }) => {
    console.log('getQuotes resolver called');
    const quotes = await getAllQuotes();
    if (!quotes || quotes.length === 0) {
      throw new Error(`No quotes found`);
    }
    return quotes;
  }
}
