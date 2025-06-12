import { supabase } from '../index.js';

export class User {
  // Chỉ định các trường hợp lệ cho schema
  static fields = ['id', 'username', 'email', 'password', 'role', 'created_at'];

  // Lấy user theo id
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select(User.fields.join(','))
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  // Tạo user mới, chỉ nhận đúng các trường hợp lệ
  static async create(userData) {
    const validData = User.pickValidFields(userData, ['username', 'email', 'password', 'role']);
    if (!validData.username || !validData.email || !validData.password) {
      throw new Error('username, email, and password are required');
    }
    if (!validData.role) validData.role = 'user';
    const { data, error } = await supabase
      .from('users')
      .insert([validData])
      .select(User.fields.join(','))
      .single();
    if (error) throw error;
    return data;
  }

  // Cập nhật user, chỉ cho phép cập nhật các trường hợp lệ (trừ id, created_at)
  static async update(id, userData) {
    const validData = User.pickValidFields(userData, ['username', 'email', 'password', 'role']);
    if (Object.keys(validData).length === 0) throw new Error('No valid fields to update');
    const { data, error } = await supabase
      .from('users')
      .update(validData)
      .eq('id', id)
      .select(User.fields.join(','))
      .single();
    if (error) throw error;
    return data;
  }

  // Xóa user theo id
  static async delete(id) {
    const { error } = await supabase
      .from('users')
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