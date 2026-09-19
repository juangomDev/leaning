import { WalletFactory } from '../../../domain/wallet/WalletFactory.js';
import { IWalletRepository } from '../ports/IWalletRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { IClock, SystemClock } from '../../shared/ports/IClock.js';
import { Money } from '../../../domain/shared/value-objects/Money.js';
import { RechargeWalletDTO, RechargeWalletResponseDTO } from '../dtos/index.js';
import { WalletMapper } from '../mappers/WalletMapper.js';

export interface RechargeWalletDeps {
  walletRepository: IWalletRepository;
  clock?: IClock;
}

export class RechargeWalletUseCase implements IUseCase<RechargeWalletDTO, RechargeWalletResponseDTO> {
  private readonly walletRepository: IWalletRepository;
  private readonly clock: IClock;

  constructor({ walletRepository, clock = new SystemClock() }: RechargeWalletDeps) {
    this.walletRepository = walletRepository;
    this.clock = clock;
  }

  async execute({ userId, amount, method = 'Tarjeta de Crédito' }: RechargeWalletDTO): Promise<RechargeWalletResponseDTO> {
    const money = Money.create(Number(amount));

    const transaction = WalletFactory.createTransaction({
      walletId: userId,
      userId,
      amount: money.amount,
      type: 'recharge',
      concept: `Recarga de Saldo con ${method}`,
      createdAt: this.clock.now(),
    });

    await this.walletRepository.addTransaction(transaction);
    const newBalance = await this.walletRepository.getBalance(userId);

    return {
      newBalance,
      transaction: WalletMapper.toTransactionDTO(transaction),
    };
  }
}
