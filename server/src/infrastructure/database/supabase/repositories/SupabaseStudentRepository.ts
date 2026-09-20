import { IStudentRepository } from '../../../../domain/student/StudentRepository.js';
import { Student } from '../../../../domain/student/Student.js';
import { dbClient as supabase } from '../client.js';
import { StudentMapper } from '../mappers/StudentMapper.js';

export class SupabaseStudentRepository implements IStudentRepository {
  async findById(id: string): Promise<Student | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
    if (error || !data) return null;

    return StudentMapper.toDomain(data);
  }

  async findByUserId(userId: string): Promise<Student | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.from('students').select('*').eq('user_id', userId).maybeSingle();
    if (error || !data) return null;

    return StudentMapper.toDomain(data);
  }

  async create(student: Student): Promise<Student> {
    if (!supabase) return student;

    const row = StudentMapper.toRow(student);
    const { data, error } = await supabase
      .from('students')
      .insert({
        id: student.id,
        user_id: row.user_id,
        education_level: row.education_level,
        learning_goals: row.learning_goals,
        created_at: student.createdAt.toISOString(),
        updated_at: student.updatedAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return StudentMapper.toDomain(data);
  }

  async update(id: string, updates: Partial<Student>): Promise<Student> {
    if (!supabase) {
      const existing = await this.findById(id);
      return existing || (updates as Student);
    }

    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.educationLevel !== undefined) payload.education_level = updates.educationLevel;
    if (updates.learningGoals !== undefined) payload.learning_goals = updates.learningGoals;

    const { data, error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return StudentMapper.toDomain(data);
  }
}
