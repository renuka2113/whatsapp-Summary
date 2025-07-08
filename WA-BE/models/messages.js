import mongoose from 'mongoose';

const userMessagesSchema = new mongoose.Schema({
  messages: {
    type: [String],
    required: true
  },
  timestamp: {
    type: [Date],
    required: true
  }
}, { _id: false });


const dateDataSchema = new mongoose.Schema({
  users: {
    type: Map,
    of: userMessagesSchema,
    required: true
  }
}, { _id: false });

const nestedGroupSchema = new mongoose.Schema({
  groupid: {
    type: Number,
    required: true
  }
}, { strict: false }); 

const NestedChatGroup = mongoose.model('messages', nestedGroupSchema);
export default NestedChatGroup;
