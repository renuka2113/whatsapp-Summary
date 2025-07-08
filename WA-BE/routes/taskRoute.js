import express from 'express';
import {
  createTask,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
  getTasksByOfficer // ← Add this
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/create', createTask);
router.get('/all', getAllTasks);
router.get('/byOfficer/:mem_id', getTasksByOfficer); // ← Add this line
router.put('/update/:id', updateTaskStatus);
router.delete('/delete/:id', deleteTask);

export default router;
