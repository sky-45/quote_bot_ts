
import { Schema } from 'mongoose'
import {connectionMongoDB} from '../../connections/mongodbConnection'
import {Quote} from '../../graphql/__generated__/types'

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

