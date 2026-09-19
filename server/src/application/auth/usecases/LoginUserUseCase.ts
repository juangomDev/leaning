import { IUserRepository } from '../ports/IUserRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { LoginUserInputDTO, AuthResponseDTO } from '../dtos/index.js';
import { UserMapper } from '../mappers/UserMapper.js';
import { InvalidCredentialsError } from '../errors/index.js';

export interface LoginUserDeps {
  userRepository: IUserRepository;
}

export class LoginUserUseCase implements IUseCase<LoginUserInputDTO, AuthResponseDTO> {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: LoginUserDeps) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }: LoginUserInputDTO): Promise<AuthResponseDTO> {
    try {
      const authResult = await this.userRepository.authenticate(email, password);
      return {
        user: UserMapper.toDTO(authResult.user),
        token: authResult.token,
      };
    } catch (err: any) {
      if (err.name === 'UnauthorizedError' || err.statusCode === 401) {
        throw new InvalidCredentialsError(err.message || 'Credenciales inválidas');
      }
      throw err;
    }
  }
}
