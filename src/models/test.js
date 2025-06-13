import { supabase } from '../index.js';

export class Test {
  static fields = ['id', 'title', 'description', 'created_at'];

  static async findById(id) {
    const { data, error } = await supabase
      .from('tests')
      .select(Test.fields.join(','))
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async create(testData) {
    const validData = Test.pickValidFields(testData, ['title', 'description']);
    if (!validData.title) throw new Error('Title is required');

    const { data, error } = await supabase
      .from('tests')
      .insert([validData])
      .select(Test.fields.join(','))
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id, testData) {
    const validData = Test.pickValidFields(testData, ['title', 'description']);
    if (Object.keys(validData).length === 0) throw new Error('No valid fields to update');

    const { data, error } = await supabase
      .from('tests')
      .update(validData)
      .eq('id', id)
      .select(Test.fields.join(','))
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('tests')
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
