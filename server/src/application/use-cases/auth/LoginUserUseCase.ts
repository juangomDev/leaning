import { IUserRepository, AuthResult } from '../../../domain/repositories/IUserRepository.js';

export interface LoginUserDTO {
  email: string;
  password?: string;
}

export class LoginUserUseCase {
  private userRepository: IUserRepository;

  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }: LoginUserDTO): Promise<AuthResult> {
    return await this.userRepository.authenticate(email, password);
  }
}
