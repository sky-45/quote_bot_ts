
import { Schema } from 'mongoose'
import {connectionMongoDB} from '@connections/mongodbConnection/index.js'
import {Channel} from '@graph_types/types.js'

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

