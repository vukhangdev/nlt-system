import { supabase } from '../index.js';

export class CultureTest {
  static fields = ['id', 'created_at', 'order', 'question', 'multiple_choice', 'answer'];

  // Lấy toàn bộ câu hỏi (sắp xếp theo thứ tự)
  static async getAll() {
    const { data, error } = await supabase
      .from('culture_test')
      .select(CultureTest.fields.join(','))
      .order('order', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Lấy 1 câu hỏi theo id
  static async findById(id) {
    const { data, error } = await supabase
      .from('culture_test')
      .select(CultureTest.fields.join(','))
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Tạo câu hỏi mới
  static async create(questionData) {
    const validData = CultureTest.pickValidFields(
      questionData,
      ['order', 'question', 'multiple_choice', 'answer']
    );

    if (!validData.question || !validData.multiple_choice || !validData.answer) {
      throw new Error('Missing required fields: question, multiple_choice, or answer');
    }

    const { data, error } = await supabase
      .from('culture_test')
      .insert([validData])
      .select(CultureTest.fields.join(','))
      .single();

    if (error) throw error;
    return data;
  }

  // Cập nhật câu hỏi theo id
  static async update(id, questionData) {
    const validData = CultureTest.pickValidFields(
      questionData,
      ['order', 'question', 'multiple_choice', 'answer']
    );

    if (Object.keys(validData).length === 0) throw new Error('No valid fields to update');

    const { data, error } = await supabase
      .from('culture_test')
      .update(validData)
      .eq('id', id)
      .select(CultureTest.fields.join(','))
      .single();

    if (error) throw error;
    return data;
  }

  // Xóa câu hỏi theo id
  static async delete(id) {
    const { error } = await supabase
      .from('culture_test')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Helper: chỉ lấy các trường hợp lệ
  static pickValidFields(data, allowedFields) {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
  }
}
