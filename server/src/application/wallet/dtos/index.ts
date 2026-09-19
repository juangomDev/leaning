export interface RechargeWalletDTO {
  userId: string;
  amount: number | string;
  method?: string;
}

export interface WalletTransactionResponseDTO {
  id: string;
  walletId: string;
  userId: string;
  bookingId: string | null;
  amount: number;
  type: string;
  concept: string;
  status: string;
  createdAt: string;
}

export interface WalletBalanceResponseDTO {
  balance: number;
  transactions: WalletTransactionResponseDTO[];
}

export interface RechargeWalletResponseDTO {
  newBalance: number;
  transaction: WalletTransactionResponseDTO;
}
