import { config } from './config/env.js';

// Domain Ports
import { IUserRepository } from '../domain/user/UserRepository.js';
import { IStudentRepository } from '../domain/student/StudentRepository.js';
import { ITutorRepository } from '../domain/tutor/TutorRepository.js';
import { IBookingRepository } from '../domain/booking/BookingRepository.js';
import { IReviewRepository } from '../domain/review/ReviewRepository.js';
import { IWalletRepository } from '../domain/wallet/WalletRepository.js';
import { IAuthService } from '../application/shared/ports/IAuthService.js';
import { INotificationService } from '../application/shared/ports/INotificationService.js';
import { IClock, SystemClock } from '../application/shared/ports/IClock.js';

// In-Memory Repositories
import {
  InMemoryUserRepository,
  InMemoryStudentRepository,
  InMemoryTutorRepository,
  InMemoryBookingRepository,
  InMemoryReviewRepository,
  InMemoryWalletRepository,
} from './database/memory/index.js';

// Supabase Repositories
import {
  SupabaseUserRepository,
  SupabaseStudentRepository,
  SupabaseTutorRepository,
  SupabaseBookingRepository,
  SupabaseReviewRepository,
  SupabaseWalletRepository,
} from './database/supabase/repositories/index.js';

// Auth Services
import { InMemoryAuthService } from './auth/InMemoryAuthService.js';
import { SupabaseAuthService } from './auth/SupabaseAuthService.js';

// Notification Services
import { ConsoleNotificationService } from './notifications/ConsoleNotificationService.js';
import { ResendEmailService } from './notifications/ResendEmailService.js';

// Use Cases - Auth
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
} from '../application/auth/index.js';

// Use Cases - Student
import {
  CreateStudentProfileUseCase,
  GetStudentProfileUseCase,
  UpdateStudentProfileUseCase,
} from '../application/student/index.js';

// Use Cases - Tutors
import {
  GetTutorsListUseCase,
  GetTutorByIdUseCase,
  RegisterTutorUseCase,
  AddTutorSubjectUseCase,
} from '../application/tutor/index.js';

// Use Cases - Bookings
import {
  CreateBookingUseCase,
  GetUserBookingsUseCase,
  UpdateBookingStatusUseCase,
  CancelBookingUseCase,
} from '../application/booking/index.js';

// Use Cases - Review
import {
  CreateReviewUseCase,
  GetTutorReviewsUseCase,
} from '../application/review/index.js';

// Use Cases - Wallet
import {
  GetWalletBalanceUseCase,
  RechargeWalletUseCase,
} from '../application/wallet/index.js';

// Use Cases - Notification
import {
  SendBookingConfirmationUseCase,
  SendBookingCancellationUseCase,
} from '../application/notification/index.js';

// Use Cases - Admin
import {
  ApproveTutorUseCase,
  BanUserUseCase,
  ModerateReviewUseCase,
} from '../application/admin/index.js';

// Controllers
import { AuthController } from '../interfaces/http/controllers/AuthController.js';
import { TutorController } from '../interfaces/http/controllers/TutorController.js';
import { BookingController } from '../interfaces/http/controllers/BookingController.js';
import { WalletController } from '../interfaces/http/controllers/WalletController.js';

export class Container {
  // Shared Infrastructure & Services
  public clock: IClock;
  public authService: IAuthService;
  public notificationService: INotificationService;

  // Repositories
  public userRepository: IUserRepository;
  public studentRepository: IStudentRepository;
  public tutorRepository: ITutorRepository;
  public bookingRepository: IBookingRepository;
  public reviewRepository: IReviewRepository;
  public walletRepository: IWalletRepository;

  // Use Cases - Auth
  public registerUserUseCase: RegisterUserUseCase;
  public loginUserUseCase: LoginUserUseCase;
  public getCurrentUserUseCase: GetCurrentUserUseCase;

  // Use Cases - Student
  public createStudentProfileUseCase: CreateStudentProfileUseCase;
  public getStudentProfileUseCase: GetStudentProfileUseCase;
  public updateStudentProfileUseCase: UpdateStudentProfileUseCase;

  // Use Cases - Tutors
  public getTutorsListUseCase: GetTutorsListUseCase;
  public getTutorByIdUseCase: GetTutorByIdUseCase;
  public registerTutorUseCase: RegisterTutorUseCase;
  public addTutorSubjectUseCase: AddTutorSubjectUseCase;

  // Use Cases - Bookings
  public createBookingUseCase: CreateBookingUseCase;
  public getUserBookingsUseCase: GetUserBookingsUseCase;
  public updateBookingStatusUseCase: UpdateBookingStatusUseCase;
  public cancelBookingUseCase: CancelBookingUseCase;

  // Use Cases - Review
  public createReviewUseCase: CreateReviewUseCase;
  public getTutorReviewsUseCase: GetTutorReviewsUseCase;

  // Use Cases - Wallet
  public getWalletBalanceUseCase: GetWalletBalanceUseCase;
  public rechargeWalletUseCase: RechargeWalletUseCase;

  // Use Cases - Notification
  public sendBookingConfirmationUseCase: SendBookingConfirmationUseCase;
  public sendBookingCancellationUseCase: SendBookingCancellationUseCase;

  // Use Cases - Admin
  public approveTutorUseCase: ApproveTutorUseCase;
  public banUserUseCase: BanUserUseCase;
  public moderateReviewUseCase: ModerateReviewUseCase;

  // Controllers
  public authController: AuthController;
  public tutorController: TutorController;
  public bookingController: BookingController;
  public walletController: WalletController;

  constructor() {
    const isSupabase = config.isSupabaseConfigured();
    console.log(`[Container] Inicializando repositorios con: ${isSupabase ? 'Supabase Database' : 'In-Memory Mock Database'}`);

    // 1. Clock
    this.clock = new SystemClock();

    // 2. Auth Service & Notification Service
    this.authService = isSupabase ? new SupabaseAuthService() : new InMemoryAuthService();
    this.notificationService = config.isResendConfigured()
      ? new ResendEmailService()
      : new ConsoleNotificationService();

    // 3. Repositories
    this.userRepository = isSupabase ? new SupabaseUserRepository() : new InMemoryUserRepository();
    this.studentRepository = isSupabase ? new SupabaseStudentRepository() : new InMemoryStudentRepository();
    this.tutorRepository = isSupabase ? new SupabaseTutorRepository() : new InMemoryTutorRepository();
    this.bookingRepository = isSupabase ? new SupabaseBookingRepository() : new InMemoryBookingRepository();
    this.reviewRepository = isSupabase ? new SupabaseReviewRepository() : new InMemoryReviewRepository();
    this.walletRepository = isSupabase ? new SupabaseWalletRepository() : new InMemoryWalletRepository();

    // 4. Use Cases - Auth
    this.registerUserUseCase = new RegisterUserUseCase({
      userRepository: this.userRepository,
      clock: this.clock,
    });
    this.loginUserUseCase = new LoginUserUseCase({ userRepository: this.userRepository });
    this.getCurrentUserUseCase = new GetCurrentUserUseCase({ userRepository: this.userRepository });

    // 5. Use Cases - Student
    this.createStudentProfileUseCase = new CreateStudentProfileUseCase({ studentRepository: this.studentRepository });
    this.getStudentProfileUseCase = new GetStudentProfileUseCase({ studentRepository: this.studentRepository });
    this.updateStudentProfileUseCase = new UpdateStudentProfileUseCase({ studentRepository: this.studentRepository });

    // 6. Use Cases - Tutors
    this.getTutorsListUseCase = new GetTutorsListUseCase({ tutorRepository: this.tutorRepository });
    this.getTutorByIdUseCase = new GetTutorByIdUseCase({ tutorRepository: this.tutorRepository });
    this.registerTutorUseCase = new RegisterTutorUseCase({
      tutorRepository: this.tutorRepository,
      clock: this.clock,
    });
    this.addTutorSubjectUseCase = new AddTutorSubjectUseCase({ tutorRepository: this.tutorRepository });

    // 7. Use Cases - Bookings
    this.createBookingUseCase = new CreateBookingUseCase({
      bookingRepository: this.bookingRepository,
      tutorRepository: this.tutorRepository,
      clock: this.clock,
    });
    this.getUserBookingsUseCase = new GetUserBookingsUseCase({ bookingRepository: this.bookingRepository });
    this.updateBookingStatusUseCase = new UpdateBookingStatusUseCase({ bookingRepository: this.bookingRepository });
    this.cancelBookingUseCase = new CancelBookingUseCase({ bookingRepository: this.bookingRepository });

    // 8. Use Cases - Review
    this.createReviewUseCase = new CreateReviewUseCase({
      reviewRepository: this.reviewRepository,
      bookingRepository: this.bookingRepository,
      tutorRepository: this.tutorRepository,
    });
    this.getTutorReviewsUseCase = new GetTutorReviewsUseCase({ reviewRepository: this.reviewRepository });

    // 9. Use Cases - Wallet
    this.getWalletBalanceUseCase = new GetWalletBalanceUseCase({ walletRepository: this.walletRepository });
    this.rechargeWalletUseCase = new RechargeWalletUseCase({
      walletRepository: this.walletRepository,
      clock: this.clock,
    });

    // 10. Use Cases - Notification
    this.sendBookingConfirmationUseCase = new SendBookingConfirmationUseCase({
      bookingRepository: this.bookingRepository,
      notificationService: this.notificationService,
    });
    this.sendBookingCancellationUseCase = new SendBookingCancellationUseCase({
      bookingRepository: this.bookingRepository,
      notificationService: this.notificationService,
    });

    // 11. Use Cases - Admin
    this.approveTutorUseCase = new ApproveTutorUseCase({ tutorRepository: this.tutorRepository });
    this.banUserUseCase = new BanUserUseCase({ userRepository: this.userRepository });
    this.moderateReviewUseCase = new ModerateReviewUseCase({ reviewRepository: this.reviewRepository });

    // 12. Controllers
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
