import Task from '../models/tasks.js';

export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tasks', details: err.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completion_message_id } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { status, completion_message_id },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.status(200).json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task', details: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.status(200).json({ message: ' Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task', details: err.message });
  }
};


export const getTasksByOfficer = async (req, res) => {
  const { mem_id } = req.params;
  try {
    const tasks = await Task.find({
      $or: [{ assigned_by: mem_id }, { assigned_to: mem_id }],
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
};
