import express from 'express';
import { uploadMember, getMember, loginByName, addPreference } from '../controllers/membersController.js';

const router = express.Router();

router.post('/membersInsert', uploadMember);
router.post('/membersRetrieve',getMember);
router.post('/login', loginByName); 
router.post('/addPreference', addPreference);
export default router;