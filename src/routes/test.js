import express from 'express';
import { createFullTestController, getTestController, submitTestController, addQuestionsController, updateQuestionsController  } from '../controllers/testController.js';

const router = express.Router();

// Routes requiring authentication
router.post('/createTest', createFullTestController);
router.get('/:id', getTestController);
router.post('/submit', submitTestController);
router.post('/addQuestions', addQuestionsController);
router.put('/updateQuestions', updateQuestionsController);
    
export default router;
