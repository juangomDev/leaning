import { User } from '../../../domain/user/User.js';
import { NotFoundError } from '../../../domain/shared/errors/DomainError.js';
import { IUserRepository } from '../../../domain/user/UserRepository.js';

export class GetCurrentUserUseCase {
  private userRepository: IUserRepository;

  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario');
    }
    return user;
  }
}
