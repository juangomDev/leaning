import { IUserRepository } from '../ports/IUserRepository.js';
import { IStudentRepository } from '../../../domain/student/StudentRepository.js';
import { ITutorRepository } from '../../../domain/tutor/TutorRepository.js';
import { StudentFactory } from '../../../domain/student/StudentFactory.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { UserResponseDTO } from '../dtos/index.js';
import { UserMapper } from '../mappers/UserMapper.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

export interface CompleteOnboardingInput {
  userId: string;
  role?: string;
  educationLevel?: string;
  learningGoals?: string | string[];
  preferredSubjects?: string[];
  schedulePreference?: string;
  bio?: string;
  hourlyRate?: number;
  experienceYears?: number;
  degree?: string;
}

export interface CompleteOnboardingOutput {
  success: boolean;
  message: string;
  user: UserResponseDTO;
}

export interface CompleteOnboardingDeps {
  userRepository: IUserRepository;
  studentRepository?: IStudentRepository;
  tutorRepository?: ITutorRepository;
}

export class CompleteOnboardingUseCase implements IUseCase<CompleteOnboardingInput, CompleteOnboardingOutput> {
  private readonly userRepository: IUserRepository;
  private readonly studentRepository?: IStudentRepository;
  private readonly tutorRepository?: ITutorRepository;

  constructor({ userRepository, studentRepository, tutorRepository }: CompleteOnboardingDeps) {
    this.userRepository = userRepository;
    this.studentRepository = studentRepository;
    this.tutorRepository = tutorRepository;
  }

  async execute(input: CompleteOnboardingInput): Promise<CompleteOnboardingOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const isTutor = user.isTutor() || input.role === 'tutor';

    if (!isTutor && this.studentRepository) {
      // Perfil de estudiante
      const goals = Array.isArray(input.learningGoals)
        ? input.learningGoals.join(', ')
        : (input.learningGoals || 'Aprender y mejorar habilidades académicas');
      const level = input.educationLevel || 'Universidad';

      const existingProfile = await this.studentRepository.findByUserId(user.id);
      if (existingProfile) {
        existingProfile.updateGoals(goals);
        existingProfile.updateEducationLevel(level);
        await this.studentRepository.update(existingProfile.id, existingProfile);
      } else {
        const newProfile = StudentFactory.create({
          userId: user.id,
          educationLevel: level,
          learningGoals: goals,
        });
        await this.studentRepository.create(newProfile);
      }
    } else if (isTutor && this.tutorRepository) {
      // Perfil de tutor
      const tutor = await this.tutorRepository.findById(user.id);
      if (tutor && (input.bio || input.hourlyRate)) {
        if (input.bio) tutor.updateBio(input.bio);
        await this.tutorRepository.update(tutor.id, tutor);
      }
    }

    user.completeOnboarding();
    await this.userRepository.update(user.id, user);

    return {
      success: true,
      message: 'Onboarding completado con éxito',
      user: UserMapper.toDTO(user),
    };
  }
}
