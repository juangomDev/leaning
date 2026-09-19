import { IStudentRepository } from '../ports/IStudentRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { UpdateStudentProfileDTO, StudentResponseDTO } from '../dtos/index.js';
import { StudentMapper } from '../mappers/StudentMapper.js';

export interface UpdateStudentProfileDeps {
  studentRepository: IStudentRepository;
}

export class UpdateStudentProfileUseCase implements IUseCase<UpdateStudentProfileDTO, StudentResponseDTO> {
  private readonly studentRepository: IStudentRepository;

  constructor({ studentRepository }: UpdateStudentProfileDeps) {
    this.studentRepository = studentRepository;
  }

  async execute(dto: UpdateStudentProfileDTO): Promise<StudentResponseDTO> {
    let student = null;

    if (dto.id) {
      student = await this.studentRepository.findById(dto.id);
    } else if (dto.userId) {
      student = await this.studentRepository.findByUserId(dto.userId);
    }

    if (!student) {
      throw new NotFoundError('Perfil de estudiante');
    }

    if (dto.educationLevel) {
      student.updateEducationLevel(dto.educationLevel);
    }

    if (dto.learningGoals) {
      student.updateGoals(dto.learningGoals);
    }

    const updated = await this.studentRepository.update(student.id, student);
    return StudentMapper.toDTO(updated);
  }
}
