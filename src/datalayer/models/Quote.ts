
import { Schema } from 'mongoose'
import {connectionMongoDB} from '@connections/mongodbConnection/index.js'
import {Quote} from '@graph_types/types.js'

const QuoteSchema = new Schema({
  quote: {
    type     : String,
    required : true
  },
  author: {
    type     : String,
    required : true
  }
}, { timestamps: true })

const QuoteModel = connectionMongoDB.model<Quote>('Quote', QuoteSchema)

export {
  QuoteModel
}

