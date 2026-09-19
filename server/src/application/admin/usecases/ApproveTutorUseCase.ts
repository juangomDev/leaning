import { ITutorRepository } from '../../tutor/ports/ITutorRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { ApproveTutorDTO, AdminOperationResultDTO } from '../dtos/index.js';

export interface ApproveTutorDeps {
  tutorRepository: ITutorRepository;
}

export class ApproveTutorUseCase implements IUseCase<ApproveTutorDTO, AdminOperationResultDTO> {
  private readonly tutorRepository: ITutorRepository;

  constructor({ tutorRepository }: ApproveTutorDeps) {
    this.tutorRepository = tutorRepository;
  }

  async execute({ tutorId, badge = 'Verificado' }: ApproveTutorDTO): Promise<AdminOperationResultDTO> {
    const tutor = await this.tutorRepository.findById(tutorId);
    if (!tutor) {
      throw new NotFoundError(`Tutor con ID '${tutorId}'`);
    }

    tutor.setAvailability(true);
    if (!tutor.badges.includes(badge)) {
      tutor.badges.push(badge);
    }

    await this.tutorRepository.update(tutor.id, tutor);

    return {
      success: true,
      targetId: tutor.id,
      message: `Tutor ${tutor.fullName} aprobado con éxito con la insignia '${badge}'`,
    };
  }
}
