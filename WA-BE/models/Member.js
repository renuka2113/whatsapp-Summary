import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  mem_id: String,
  grp_id: String,
  Sub_Division: String,
  Circle: String,
  Rank: String,
  Officer_Name: String,
  Mobile_no: String,
  Preferences:{
    type:[String],
    default:[]
  },
});

const Member = mongoose.model('members', memberSchema);

export default Member;
