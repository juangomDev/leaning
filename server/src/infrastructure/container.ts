import { config } from '../config/env.js';

// Repositories Ports
import { IUserRepository } from '../domain/user/UserRepository.js';
import { ITutorRepository } from '../domain/tutor/TutorRepository.js';
import { IBookingRepository } from '../domain/booking/BookingRepository.js';
import { IWalletRepository } from '../domain/wallet/WalletRepository.js';

// In-Memory Repositories
import { InMemoryUserRepository } from './memory/InMemoryUserRepository.js';
import { InMemoryTutorRepository } from './memory/InMemoryTutorRepository.js';
import { InMemoryBookingRepository } from './memory/InMemoryBookingRepository.js';
import { InMemoryWalletRepository } from './memory/InMemoryWalletRepository.js';

// Supabase Repositories
import { SupabaseUserRepository } from './database/repositories/SupabaseUserRepository.js';
import { SupabaseTutorRepository } from './database/repositories/SupabaseTutorRepository.js';
import { SupabaseBookingRepository } from './database/repositories/SupabaseBookingRepository.js';

// Use Cases - Auth
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
} from '../application/auth/index.js';

// Use Cases - Tutors
import {
  GetTutorsListUseCase,
  GetTutorByIdUseCase,
  RegisterTutorUseCase,
} from '../application/tutor/index.js';

// Use Cases - Bookings
import {
  CreateBookingUseCase,
  GetUserBookingsUseCase,
  UpdateBookingStatusUseCase,
} from '../application/booking/index.js';

// Use Cases - Wallet
import {
  GetWalletBalanceUseCase,
  RechargeWalletUseCase,
} from '../application/wallet/index.js';

// Controllers
import { AuthController } from '../interfaces/http/controllers/AuthController.js';
import { TutorController } from '../interfaces/http/controllers/TutorController.js';
import { BookingController } from '../interfaces/http/controllers/BookingController.js';
import { WalletController } from '../interfaces/http/controllers/WalletController.js';

export class Container {
  public userRepository: IUserRepository;
  public tutorRepository: ITutorRepository;
  public bookingRepository: IBookingRepository;
  public walletRepository: IWalletRepository;

  public registerUserUseCase: RegisterUserUseCase;
  public loginUserUseCase: LoginUserUseCase;
  public getCurrentUserUseCase: GetCurrentUserUseCase;

  public getTutorsListUseCase: GetTutorsListUseCase;
  public getTutorByIdUseCase: GetTutorByIdUseCase;
  public registerTutorUseCase: RegisterTutorUseCase;

  public createBookingUseCase: CreateBookingUseCase;
  public getUserBookingsUseCase: GetUserBookingsUseCase;
  public updateBookingStatusUseCase: UpdateBookingStatusUseCase;

  public getWalletBalanceUseCase: GetWalletBalanceUseCase;
  public rechargeWalletUseCase: RechargeWalletUseCase;

  public authController: AuthController;
  public tutorController: TutorController;
  public bookingController: BookingController;
  public walletController: WalletController;

  constructor() {
    const isSupabase = config.isSupabaseConfigured();
    console.log(`[Container] Inicializando repositorios con: ${isSupabase ? 'Supabase Database' : 'In-Memory Mock Database'}`);

    // 1. Repositories
    this.userRepository = isSupabase ? new SupabaseUserRepository() : new InMemoryUserRepository();
    this.tutorRepository = isSupabase ? new SupabaseTutorRepository() : new InMemoryTutorRepository();
    this.bookingRepository = isSupabase ? new SupabaseBookingRepository() : new InMemoryBookingRepository();
    this.walletRepository = new InMemoryWalletRepository();

    // 2. Use Cases - Auth
    this.registerUserUseCase = new RegisterUserUseCase({ userRepository: this.userRepository });
    this.loginUserUseCase = new LoginUserUseCase({ userRepository: this.userRepository });
    this.getCurrentUserUseCase = new GetCurrentUserUseCase({ userRepository: this.userRepository });

    // 3. Use Cases - Tutors
    this.getTutorsListUseCase = new GetTutorsListUseCase({ tutorRepository: this.tutorRepository });
    this.getTutorByIdUseCase = new GetTutorByIdUseCase({ tutorRepository: this.tutorRepository });
    this.registerTutorUseCase = new RegisterTutorUseCase({ tutorRepository: this.tutorRepository });

    // 4. Use Cases - Bookings
    this.createBookingUseCase = new CreateBookingUseCase({
      bookingRepository: this.bookingRepository,
      tutorRepository: this.tutorRepository,
    });
    this.getUserBookingsUseCase = new GetUserBookingsUseCase({ bookingRepository: this.bookingRepository });
    this.updateBookingStatusUseCase = new UpdateBookingStatusUseCase({ bookingRepository: this.bookingRepository });

    // 5. Use Cases - Wallet
    this.getWalletBalanceUseCase = new GetWalletBalanceUseCase({ walletRepository: this.walletRepository });
    this.rechargeWalletUseCase = new RechargeWalletUseCase({ walletRepository: this.walletRepository });

    // 6. Controllers
    this.authController = new AuthController({
      registerUserUseCase: this.registerUserUseCase,
      loginUserUseCase: this.loginUserUseCase,
      getCurrentUserUseCase: this.getCurrentUserUseCase,
    });

    this.tutorController = new TutorController({
      getTutorsListUseCase: this.getTutorsListUseCase,
      getTutorByIdUseCase: this.getTutorByIdUseCase,
      registerTutorUseCase: this.registerTutorUseCase,
    });

    this.bookingController = new BookingController({
      createBookingUseCase: this.createBookingUseCase,
      getUserBookingsUseCase: this.getUserBookingsUseCase,
      updateBookingStatusUseCase: this.updateBookingStatusUseCase,
    });

    this.walletController = new WalletController({
      getWalletBalanceUseCase: this.getWalletBalanceUseCase,
      rechargeWalletUseCase: this.rechargeWalletUseCase,
    });
  }
}

export const container = new Container();
