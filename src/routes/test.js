import express from 'express';
import { createFullTestController, getTestController } from '../controllers/testController.js';

const router = express.Router();

router.post('/createTest', createFullTestController);
router.get('/:id', getTestController);

export default router;
