import express from 'express';
import { getMessage, sendMessage } from '../controllers/message.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Route for sending a message
router.route('/send/:id').post(isAuthenticated, sendMessage);

// Route for getting all messages in a conversation
router.route('/all/:id').get(isAuthenticated, getMessage);  

export default router;
