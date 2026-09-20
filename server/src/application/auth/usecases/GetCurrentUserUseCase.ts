import { IUserRepository } from '../ports/IUserRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { UserResponseDTO } from '../dtos/index.js';
import { UserMapper } from '../mappers/UserMapper.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { UserFactory } from '../../../domain/user/UserFactory.js';

export interface GetCurrentUserDeps {
  userRepository: IUserRepository;
}

export type GetCurrentUserInput = { userId: string; email?: string; role?: string } | string;

export class GetCurrentUserUseCase implements IUseCase<GetCurrentUserInput, UserResponseDTO> {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: GetCurrentUserDeps) {
    this.userRepository = userRepository;
  }

  async execute(input: GetCurrentUserInput): Promise<UserResponseDTO> {
    const id = typeof input === 'string' ? input : input.userId;
    const email = typeof input === 'object' ? input.email : undefined;
    const role = typeof input === 'object' ? input.role : undefined;

    let user = await this.userRepository.findById(id);

    // Si no se encuentra por id exacto pero tenemos el email verificado del token
    if (!user && email) {
      user = await this.userRepository.findByEmail(email);
    }

    // Fallback de desarrollo: si el usuario no existe tras reinicio en memoria
    // pero el token JWT fue verificado con éxito (trae email o ID de tipo 'usr-slug')
    if (!user && (email || (id && id.startsWith('usr-')))) {
      const derivedEmail = email || `${id.replace(/^usr-/, '')}@example.com`;
      const fallbackName = derivedEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);

      const newUser = UserFactory.create({
        id,
        email: derivedEmail,
        fullName: formattedName,
        role: (role as any) || 'student',
      });
      user = await this.userRepository.create(newUser);
    }

    if (!user) {
      throw new NotFoundError(`Usuario con ID ${id}`);
    }

    return UserMapper.toDTO(user);
  }
}
