
import { Schema } from 'mongoose'
import {connectionMongoDB} from '../../connections/mongodbConnection'
import {Channel} from '../../graphql/__generated__/types'

const ChannelSchema = new Schema({
  name : {
    type     : String,
    required : true
  },
  addedBy: {
    type     : String,
    required : true
  }
}, { timestamps: true })

const ChannelModel = connectionMongoDB.model<Channel>('Channel', ChannelSchema)

export default ChannelModel

