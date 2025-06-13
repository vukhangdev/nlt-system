import { supabase } from '../index.js';

export class Choice {
  static fields = ['id', 'question_id', 'content', 'is_correct'];

  static async findById(id) {
    const { data, error } = await supabase
      .from('choices')
      .select(Choice.fields.join(','))
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async create(choiceData) {
    const validData = Choice.pickValidFields(choiceData, ['question_id', 'content', 'is_correct']);
    if (!validData.question_id || !validData.content) {
      throw new Error('question_id and content are required');
    }

    const { data, error } = await supabase
      .from('choices')
      .insert([validData])
      .select(Choice.fields.join(','))
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id, choiceData) {
    const validData = Choice.pickValidFields(choiceData, ['content', 'is_correct']);
    if (Object.keys(validData).length === 0) throw new Error('No valid fields to update');

    const { data, error } = await supabase
      .from('choices')
      .update(validData)
      .eq('id', id)
      .select(Choice.fields.join(','))
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('choices')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }

  static pickValidFields(data, allowedFields) {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
  }
}