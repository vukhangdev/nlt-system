import express from 'express';
import { createFullTestController, getTestController, submitTestController } from '../controllers/testController.js';

const router = express.Router();

router.post('/createTest', createFullTestController);
router.get('/:id', getTestController);
router.post('/submit', submitTestController);

export default router;
