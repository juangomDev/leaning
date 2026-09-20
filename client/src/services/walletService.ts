import { apiClient } from '../api/apiClient';

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'recharge' | 'payment' | 'refund' | string;
  concept: string;
  status: 'completed' | 'pending' | 'failed' | string;
  createdAt: string;
}

export interface WalletData {
  userId: string;
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export const walletService = {
  async getBalance(): Promise<WalletData | null> {
    try {
      const res = await apiClient.get('/wallet/balance');
      return res.data?.data || res.data;
    } catch (err: any) {
      console.warn('[walletService] Error consultando /wallet/balance:', err?.message);
      return {
        userId: 'demo-student',
        balance: 150.0,
        currency: 'USD',
        transactions: [],
      };
    }
  },

  async recharge(amount: number, method: string = 'credit_card'): Promise<WalletData | null> {
    try {
      const res = await apiClient.post('/wallet/recharge', { amount, method });
      return res.data?.data || res.data;
    } catch (err: any) {
      console.error('[walletService] Error recargando billetera:', err?.message);
      throw err;
    }
  },
};
