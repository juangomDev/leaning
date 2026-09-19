import { IWalletRepository } from '../ports/IWalletRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { WalletBalanceResponseDTO } from '../dtos/index.js';
import { WalletMapper } from '../mappers/WalletMapper.js';

export interface GetWalletBalanceDeps {
  walletRepository: IWalletRepository;
}

export type GetWalletBalanceInput = { userId: string } | string;

export class GetWalletBalanceUseCase implements IUseCase<GetWalletBalanceInput, WalletBalanceResponseDTO> {
  private readonly walletRepository: IWalletRepository;

  constructor({ walletRepository }: GetWalletBalanceDeps) {
    this.walletRepository = walletRepository;
  }

  async execute(input: GetWalletBalanceInput): Promise<WalletBalanceResponseDTO> {
    const userId = typeof input === 'string' ? input : input.userId;
    const balance = await this.walletRepository.getBalance(userId);
    const transactions = await this.walletRepository.getTransactions(userId);

    return {
      balance,
      transactions: transactions.map((tx) => WalletMapper.toTransactionDTO(tx)),
    };
  }
}
