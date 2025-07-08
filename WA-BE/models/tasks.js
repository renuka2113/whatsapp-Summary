  import mongoose from 'mongoose';

  const taskSchema = new mongoose.Schema({
    message_id: { type: Number, required: true },           // ID of the message where task was assigned
    assigned_by: { type: String, required: true },          // mem_id of the assigning officer
    assigned_to: { type: String, required: true },          // mem_id of the officer receiving the task
    status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
    message_date: { type: String },                               // ISO string format, can be null
    completion_message_id: { type: Number },                // ID of the message marking task completion
    description: {type:String},
  }, {
    timestamps: true 
  });

  const Task = mongoose.model('tasks', taskSchema);

  export default Task;
