import { CultureTest } from '../models/culture_test.js';

// Lấy tất cả câu hỏi
export const getAllCultureTests = async (req, res) => {
  try {
    const tests = await CultureTest.getAll();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy 1 câu hỏi theo ID
export const getCultureTestById = async (req, res) => {
  try {
    const test = await CultureTest.findById(req.params.id);
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm câu hỏi
export const createCultureTest = async (req, res) => {
  try {
    const newTest = await CultureTest.create(req.body);
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật câu hỏi
export const updateCultureTest = async (req, res) => {
  try {
    const updatedTest = await CultureTest.update(req.params.id, req.body);
    res.json(updatedTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa câu hỏi
export const deleteCultureTest = async (req, res) => {
  try {
    await CultureTest.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đáp án Training (chỉ trả về câu hỏi + đáp án trắc nghiệm)
export const getCultureTraining = async (req, res) => {
  try {
    const data = await CultureTest.getAll();
    const questions = data.map(q => ({
      id: q.id,
      order: q.order,
      question: q.question,
      multiple_choice: q.multiple_choice
    }));
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
