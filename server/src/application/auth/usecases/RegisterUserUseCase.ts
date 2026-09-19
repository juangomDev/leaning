import { UserFactory } from '../../../domain/user/UserFactory.js';
import { IUserRepository } from '../ports/IUserRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { IClock, SystemClock } from '../../shared/ports/IClock.js';
import { UserAlreadyExistsError } from '../errors/index.js';
import { RegisterUserInputDTO, UserResponseDTO } from '../dtos/index.js';
import { UserMapper } from '../mappers/UserMapper.js';

export interface RegisterUserDeps {
  userRepository: IUserRepository;
  clock?: IClock;
}

export class RegisterUserUseCase implements IUseCase<RegisterUserInputDTO, UserResponseDTO> {
  private readonly userRepository: IUserRepository;
  private readonly clock: IClock;

  constructor({ userRepository, clock = new SystemClock() }: RegisterUserDeps) {
    this.userRepository = userRepository;
    this.clock = clock;
  }

  async execute({
    email,
    password,
    fullName,
    role = 'student',
    phone = null,
  }: RegisterUserInputDTO): Promise<UserResponseDTO> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new UserAlreadyExistsError(email);
    }

    const user = UserFactory.create({
      email,
      fullName,
      role: role as any,
      avatarUrl: null,
      phone: phone || null,
      createdAt: this.clock.now(),
    });

    const saved = await this.userRepository.create(user, password);
    return UserMapper.toDTO(saved);
  }
}
