import { StudentFactory } from '../../../domain/student/StudentFactory.js';
import { IStudentRepository } from '../ports/IStudentRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { ConflictError } from '../../shared/errors/ConflictError.js';
import { CreateStudentProfileDTO, StudentResponseDTO } from '../dtos/index.js';
import { StudentMapper } from '../mappers/StudentMapper.js';

export interface CreateStudentProfileDeps {
  studentRepository: IStudentRepository;
}

export class CreateStudentProfileUseCase implements IUseCase<CreateStudentProfileDTO, StudentResponseDTO> {
  private readonly studentRepository: IStudentRepository;

  constructor({ studentRepository }: CreateStudentProfileDeps) {
    this.studentRepository = studentRepository;
  }

  async execute(dto: CreateStudentProfileDTO): Promise<StudentResponseDTO> {
    const existing = await this.studentRepository.findByUserId(dto.userId);
    if (existing) {
      throw new ConflictError(`El usuario ${dto.userId} ya cuenta con un perfil de estudiante registrado`);
    }

    const student = StudentFactory.create({
      userId: dto.userId,
      educationLevel: dto.educationLevel,
      learningGoals: dto.learningGoals,
    });

    const saved = await this.studentRepository.create(student);
    return StudentMapper.toDTO(saved);
  }
}
