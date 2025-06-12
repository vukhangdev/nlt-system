import express from 'express';
import { healthCheckController } from '../controllers/healthCheck.js';

const router = express.Router();

router.get('/healthcheck', healthCheckController);

export default router; 