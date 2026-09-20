import { apiClient } from '../../../api/apiClient';

export interface WalletTransaction {
  id: string;
  type: 'DEPOSIT' | 'BOOKING_PAYMENT' | 'REFUND' | 'deposit' | 'payment' | 'refund' | string;
  amount: number;
  description: string;
  date?: string;
  created_at?: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'completed' | 'pending' | 'failed' | string;
}

export interface WalletData {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_001',
    type: 'DEPOSIT',
    amount: 50.00,
    description: 'Recarga con Tarjeta de Crédito',
    created_at: '2026-09-18 14:20',
    date: '2026-09-18 14:20',
    status: 'COMPLETED',
  },
  {
    id: 'tx_002',
    type: 'BOOKING_PAYMENT',
    amount: 27.50,
    description: 'Reserva de clase: Cálculo con Dra. Elena Rostova',
    created_at: '2026-09-19 10:15',
    date: '2026-09-19 10:15',
    status: 'COMPLETED',
  },
  {
    id: 'tx_003',
    type: 'DEPOSIT',
    amount: 45.00,
    description: 'Recarga con PayPal',
    created_at: '2026-09-20 01:05',
    date: '2026-09-20 01:05',
    status: 'COMPLETED',
  },
];

export const studentWalletService = {
  async getWallet(): Promise<WalletData> {
    try {
      const res = await apiClient.get('/wallet/balance');
      const data = res.data?.data || res.data;
      if (typeof data?.balance === 'number') {
        return {
          balance: data.balance,
          currency: data.currency || 'USD',
          transactions: Array.isArray(data.transactions) ? data.transactions : this.getLocalTransactions(),
        };
      }
    } catch {
      // Fallback
    }

    const savedBal = localStorage.getItem('educonnect_wallet_balance');
    const balNum = savedBal !== null ? parseFloat(savedBal) : 67.50;

    return {
      balance: isNaN(balNum) ? 67.50 : balNum,
      currency: 'USD',
      transactions: this.getLocalTransactions(),
    };
  },

  async getBalance(): Promise<{ balance: number; currency: string }> {
    const data = await this.getWallet();
    return { balance: data.balance, currency: data.currency };
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    const data = await this.getWallet();
    return data.transactions;
  },

  getLocalTransactions(): WalletTransaction[] {
    const saved = localStorage.getItem('educonnect_wallet_txs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_wallet_txs', JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  },

  async recharge(amount: number, method: string = 'card'): Promise<{ newBalance: number }> {
    try {
      await apiClient.post('/wallet/recharge', { amount, method });
    } catch {
      // Continuar con persistencia local
    }

    const current = await this.getWallet();
    const newBal = current.balance + Number(amount);
    localStorage.setItem('educonnect_wallet_balance', newBal.toString());

    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      type: 'DEPOSIT',
      amount: Number(amount),
      description: `Recarga de saldo (${method.toUpperCase()})`,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'COMPLETED',
    };

    const updatedTxs = [newTx, ...current.transactions];
    localStorage.setItem('educonnect_wallet_txs', JSON.stringify(updatedTxs));

    return { newBalance: newBal };
  },
};
