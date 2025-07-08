import express from 'express';
import { insertNestedData } from '../controllers/messageController.js';

const router = express.Router();

router.post('/insertmessages', insertNestedData);

export default router;
