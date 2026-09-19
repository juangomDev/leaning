import { IUserRepository } from '../ports/IUserRepository.js';
import { IAuthService } from '../../shared/ports/IAuthService.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { LoginUserInputDTO, AuthResponseDTO } from '../dtos/index.js';
import { UserMapper } from '../mappers/UserMapper.js';
import { InvalidCredentialsError } from '../errors/index.js';

export interface LoginUserDeps {
  userRepository: IUserRepository;
  authService: IAuthService;
}

export class LoginUserUseCase implements IUseCase<LoginUserInputDTO, AuthResponseDTO> {
  private readonly userRepository: IUserRepository;
  private readonly authService: IAuthService;

  constructor({ userRepository, authService }: LoginUserDeps) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async execute({ email, password }: LoginUserInputDTO): Promise<AuthResponseDTO> {
    try {
      const auth = await this.authService.login(email, password);
      let user = auth.userId ? await this.userRepository.findById(auth.userId) : null;

      if (!user) {
        user = await this.userRepository.findByEmail(email);
      }

      if (!user) {
        throw new InvalidCredentialsError('No se encontró el perfil del usuario');
      }

      return {
        user: UserMapper.toDTO(user),
        token: auth.token,
      };
    } catch (err: any) {
      if (err instanceof InvalidCredentialsError) {
        throw err;
      }
      if (err.name === 'UnauthorizedError' || err.statusCode === 401) {
        throw new InvalidCredentialsError(err.message || 'Credenciales inválidas');
      }
      throw err;
    }
  }
}

