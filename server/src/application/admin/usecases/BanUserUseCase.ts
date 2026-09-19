import { IUserRepository } from '../../auth/ports/IUserRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BanUserDTO, AdminOperationResultDTO } from '../dtos/index.js';

export interface BanUserDeps {
  userRepository: IUserRepository;
}

export class BanUserUseCase implements IUseCase<BanUserDTO, AdminOperationResultDTO> {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: BanUserDeps) {
    this.userRepository = userRepository;
  }

  async execute({ userId, reason }: BanUserDTO): Promise<AdminOperationResultDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(`Usuario con ID '${userId}'`);
    }

    // Actualizamos usuario (o registramos estado de baneo)
    await this.userRepository.update(user.id, {
      fullName: `[BANEADO] ${user.fullName}`,
    });

    return {
      success: true,
      targetId: user.id,
      message: `Usuario ${user.email} ha sido suspendido. Motivo: ${reason}`,
    };
  }
}
