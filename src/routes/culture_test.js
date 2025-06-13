import express from 'express';
import {
  getAllCultureTests,
  getCultureTestById,
  createCultureTest,
  updateCultureTest,
  deleteCultureTest,
  getCultureTraining
} from '../controllers/culture_test.js';

const router = express.Router();

router.get('/', getAllCultureTests);             // Lấy danh sách đầy đủ
router.get('/train', getCultureTraining);        // Chế độ training phải đặt trước route có parameter
router.get('/:id', getCultureTestById);          // Lấy theo ID
router.post('/', createCultureTest);             // Thêm câu hỏi
router.put('/:id', updateCultureTest);           // Sửa câu hỏi
router.delete('/:id', deleteCultureTest);        // Xóa câu hỏi

export default router;
