import express from 'express';
import { createFullTestController, getTestController, submitTestController, addQuestionsToTestController  } from '../controllers/testController.js';

const router = express.Router();

router.post('/createTest', createFullTestController);
router.get('/:id', getTestController);
router.post('/submit', submitTestController);
router.post('/addQuestions', addQuestionsToTestController);

export default router;
