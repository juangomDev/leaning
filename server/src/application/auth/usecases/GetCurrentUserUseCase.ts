import { IUserRepository } from '../ports/IUserRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { UserResponseDTO } from '../dtos/index.js';
import { UserMapper } from '../mappers/UserMapper.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

export interface GetCurrentUserDeps {
  userRepository: IUserRepository;
}

export type GetCurrentUserInput = { userId: string } | string;

export class GetCurrentUserUseCase implements IUseCase<GetCurrentUserInput, UserResponseDTO> {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: GetCurrentUserDeps) {
    this.userRepository = userRepository;
  }

  async execute(input: GetCurrentUserInput): Promise<UserResponseDTO> {
    const id = typeof input === 'string' ? input : input.userId;
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError(`Usuario con ID ${id}`);
    }

    return UserMapper.toDTO(user);
  }
}
