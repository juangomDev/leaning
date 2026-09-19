import { IStudentRepository } from '../ports/IStudentRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { StudentResponseDTO } from '../dtos/index.js';
import { StudentMapper } from '../mappers/StudentMapper.js';

export interface GetStudentProfileDeps {
  studentRepository: IStudentRepository;
}

export interface GetStudentProfileInput {
  studentId?: string;
  userId?: string;
}

export class GetStudentProfileUseCase implements IUseCase<GetStudentProfileInput, StudentResponseDTO> {
  private readonly studentRepository: IStudentRepository;

  constructor({ studentRepository }: GetStudentProfileDeps) {
    this.studentRepository = studentRepository;
  }

  async execute(input: GetStudentProfileInput): Promise<StudentResponseDTO> {
    let student = null;

    if (input.studentId) {
      student = await this.studentRepository.findById(input.studentId);
    } else if (input.userId) {
      student = await this.studentRepository.findByUserId(input.userId);
    }

    if (!student) {
      throw new NotFoundError('Perfil de estudiante');
    }

    return StudentMapper.toDTO(student);
  }
}
