import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryUserRepository } from '../../../infrastructure/database/memory/InMemoryUserRepository.js';
import { InMemoryStudentRepository } from '../../../infrastructure/database/memory/InMemoryStudentRepository.js';
import { InMemoryTutorRepository } from '../../../infrastructure/database/memory/InMemoryTutorRepository.js';
import { InMemoryAuthService } from '../../../infrastructure/auth/InMemoryAuthService.js';
import { ConsoleNotificationService } from '../../../infrastructure/notifications/ConsoleNotificationService.js';
import { IClock } from '../../shared/ports/IClock.js';
import { UserFactory } from '../../../domain/user/UserFactory.js';
import {
  RequestPasswordResetUseCase,
  ResetPasswordUseCase,
  SendEmailVerificationUseCase,
  VerifyEmailUseCase,
  CompleteOnboardingUseCase,
} from '../index.js';

class MockClock implements IClock {
  public currentTime: Date;
  constructor(initial: Date = new Date()) {
    this.currentTime = initial;
  }
  now(): Date {
    return this.currentTime;
  }
}

describe('Auth Flow UseCases: Password Reset, Verification & Onboarding', () => {
  it('RequestPasswordReset: no revela si el correo existe pero envía email al usuario válido', async () => {
    const userRepo = new InMemoryUserRepository();
    const notifService = new ConsoleNotificationService();
    const clock = new MockClock(new Date('2026-09-20T10:00:00Z'));

    const useCase = new RequestPasswordResetUseCase({
      userRepository: userRepo,
      notificationService: notifService,
      clock,
    });

    // 1. Correo que no existe (anti-enumeración)
    const resNotFound = await useCase.execute({ email: 'desconocido@correo.com' });
    assert.equal(resNotFound.success, true);
    assert.equal(notifService.history.filter((h) => h.type === 'password_reset').length, 0);

    // 2. Correo existente
    const resFound = await useCase.execute({ email: 'alumno@educonnect.com' });
    assert.equal(resFound.success, true);
    const resetHistory = notifService.history.filter((h) => h.type === 'password_reset');
    assert.equal(resetHistory.length, 1);
    assert.equal(resetHistory[0].payload.recipientEmail, 'alumno@educonnect.com');
    assert.ok(resetHistory[0].payload.token);
  });

  it('ResetPassword: debe rechazar tokens vencidos o inexistentes y actualizar con éxito con token válido', async () => {
    const userRepo = new InMemoryUserRepository();
    const notifService = new ConsoleNotificationService();
    const authService = new InMemoryAuthService('test-secret', userRepo);
    const clock = new MockClock(new Date('2026-09-20T10:00:00Z'));

    const requestUseCase = new RequestPasswordResetUseCase({
      userRepository: userRepo,
      notificationService: notifService,
      clock,
    });
    const resetUseCase = new ResetPasswordUseCase({
      userRepository: userRepo,
      authService,
      clock,
    });

    // Solicitar token
    await requestUseCase.execute({ email: 'alumno@educonnect.com' });
    const token = notifService.history.find((h) => h.type === 'password_reset')?.payload.token;
    assert.ok(token);

    // Token inexistente
    await assert.rejects(
      async () => {
        await resetUseCase.execute({ token: 'token-falso-999', newPassword: 'newPassword123' });
      },
      { name: 'UnauthorizedError' }
    );

    // Token expirado (adelantamos el reloj 2 horas)
    clock.currentTime = new Date('2026-09-20T12:05:00Z');
    await assert.rejects(
      async () => {
        await resetUseCase.execute({ token, newPassword: 'newPassword123' });
      },
      { name: 'UnauthorizedError' }
    );

    // Generar nuevo token válido en el tiempo actual
    await requestUseCase.execute({ email: 'alumno@educonnect.com' });
    const validToken = notifService.history[notifService.history.length - 1].payload.token;

    // Ejecutar reseteo exitoso
    const result = await resetUseCase.execute({ token: validToken, newPassword: 'nuevaPasswordSegura2026' });
    assert.equal(result.success, true);

    // El token de reseteo debe haberse consumido (un solo uso)
    await assert.rejects(
      async () => {
        await resetUseCase.execute({ token: validToken, newPassword: 'otraPassword123' });
      },
      { name: 'UnauthorizedError' }
    );
  });

  it('SendEmailVerification & VerifyEmail: genera token y actualiza isEmailVerified a true', async () => {
    const userRepo = new InMemoryUserRepository();
    const notifService = new ConsoleNotificationService();

    // Crear usuario no verificado
    const unverifiedUser = UserFactory.create({
      id: 'usr-unverified-1',
      email: 'nuevo@educonnect.com',
      fullName: 'Nuevo Usuario',
      role: 'student',
      isEmailVerified: false,
    });
    await userRepo.create(unverifiedUser, 'pass123');

    const sendUseCase = new SendEmailVerificationUseCase({
      userRepository: userRepo,
      notificationService: notifService,
    });
    const verifyUseCase = new VerifyEmailUseCase({
      userRepository: userRepo,
    });

    // Enviar verificación
    const sendRes = await sendUseCase.execute({ emailOrUserId: 'nuevo@educonnect.com' });
    assert.equal(sendRes.success, true);
    const verifyHistory = notifService.history.filter((h) => h.type === 'email_verification');
    assert.equal(verifyHistory.length, 1);
    const token = verifyHistory[0].payload.token;
    assert.ok(token);

    // Verificar con token inválido
    await assert.rejects(
      async () => {
        await verifyUseCase.execute({ token: 'token-invalido' });
      },
      { name: 'UnauthorizedError' }
    );

    // Verificar con token válido
    const verifyRes = await verifyUseCase.execute({ token });
    assert.equal(verifyRes.success, true);
    assert.equal(verifyRes.user?.isEmailVerified, true);

    // Validar en repositorio
    const updatedUser = await userRepo.findById('usr-unverified-1');
    assert.equal(updatedUser?.isEmailVerified, true);
  });

  it('CompleteOnboarding: guarda metas de estudio y marca onboardingCompleted a true', async () => {
    const userRepo = new InMemoryUserRepository();
    const studentRepo = new InMemoryStudentRepository();

    const user = UserFactory.create({
      id: 'usr-onboard-student',
      email: 'onboard@educonnect.com',
      fullName: 'Estudiante Onboarding',
      role: 'student',
      onboardingCompleted: false,
    });
    await userRepo.create(user, 'pass123');

    const completeUseCase = new CompleteOnboardingUseCase({
      userRepository: userRepo,
      studentRepository: studentRepo,
    });

    const res = await completeUseCase.execute({
      userId: 'usr-onboard-student',
      role: 'student',
      educationLevel: 'Universidad',
      learningGoals: ['Aprobar Cálculo', 'Aprender Python'],
      schedulePreference: 'tardes',
    });

    assert.equal(res.success, true);
    assert.equal(res.user.onboardingCompleted, true);

    const studentProfile = await studentRepo.findByUserId('usr-onboard-student');
    assert.ok(studentProfile);
    assert.equal(studentProfile.educationLevel, 'Universidad');
    assert.ok(studentProfile.learningGoals.includes('Cálculo'));
  });
});
