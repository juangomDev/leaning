import { apiClient } from '../../../api/apiClient';

export interface EarningsBreakdown {
  id: string;
  bookingId: string;
  studentName: string;
  subjectName: string;
  date: string;
  grossAmount: number;
  platformFee: number;
  netEarnings: number;
  status: 'CREDITED' | 'IN_ESCROW' | 'PAID_OUT';
}

export interface TutorWalletSummary {
  availableBalance: number;
  totalEarnedAllTime: number;
  thisMonthEarnings: number;
  pendingEscrow: number;
  breakdown: EarningsBreakdown[];
}

const DEFAULT_BREAKDOWN: EarningsBreakdown[] = [
  {
    id: 'eb_1',
    bookingId: 'tbk_003',
    studentName: 'Camila Rodriguez',
    subjectName: 'Álgebra Lineal',
    date: '2026-09-18',
    grossAmount: 24.00,
    platformFee: 2.40,
    netEarnings: 21.60,
    status: 'CREDITED',
  },
  {
    id: 'eb_2',
    bookingId: 'tbk_001',
    studentName: 'Mateo González',
    subjectName: 'Cálculo Diferencial',
    date: '2026-09-22',
    grossAmount: 25.00,
    platformFee: 2.50,
    netEarnings: 22.50,
    status: 'IN_ESCROW',
  },
  {
    id: 'eb_3',
    bookingId: 'tbk_002',
    studentName: 'Valeria Mendoza',
    subjectName: 'Física Cuántica',
    date: '2026-09-23',
    grossAmount: 37.50,
    platformFee: 3.75,
    netEarnings: 33.75,
    status: 'IN_ESCROW',
  },
];

export const tutorWalletService = {
  async getWalletSummary(): Promise<TutorWalletSummary> {
    try {
      const res = await apiClient.get('/wallet/balance');
      const data = res.data?.data || res.data;
      if (typeof data?.balance === 'number') {
        return {
          availableBalance: data.balance,
          totalEarnedAllTime: 1420.00,
          thisMonthEarnings: 380.00,
          pendingEscrow: 56.25,
          breakdown: this.getLocalBreakdown(),
        };
      }
    } catch {
      // Fallback
    }

    const savedBal = localStorage.getItem('educonnect_wallet_balance');
    const balNum = savedBal !== null ? parseFloat(savedBal) : 480.00;

    return {
      availableBalance: isNaN(balNum) ? 480.00 : balNum,
      totalEarnedAllTime: 1420.00,
      thisMonthEarnings: 380.00,
      pendingEscrow: 56.25,
      breakdown: this.getLocalBreakdown(),
    };
  },

  getLocalBreakdown(): EarningsBreakdown[] {
    const saved = localStorage.getItem('educonnect_tutor_earnings_breakdown');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_tutor_earnings_breakdown', JSON.stringify(DEFAULT_BREAKDOWN));
    return DEFAULT_BREAKDOWN;
  },

  async requestWithdrawal(payload: {
    amount: number;
    method: 'bank' | 'paypal' | 'crypto';
    accountDetails: string;
  }): Promise<{ success: boolean; newBalance: number }> {
    const summary = await this.getWalletSummary();
    if (payload.amount > summary.availableBalance) {
      throw new Error('El monto solicitado supera el saldo disponible para retiro.');
    }

    const newBalance = summary.availableBalance - payload.amount;
    localStorage.setItem('educonnect_wallet_balance', newBalance.toString());

    // Record withdrawal entry in breakdown
    const current = this.getLocalBreakdown();
    const withdrawEntry: EarningsBreakdown = {
      id: `eb_${Date.now()}`,
      bookingId: 'WITHDRAWAL',
      studentName: `Retiro a ${payload.method.toUpperCase()}`,
      subjectName: `Detalle: ${payload.accountDetails}`,
      date: new Date().toISOString().split('T')[0],
      grossAmount: -payload.amount,
      platformFee: 0,
      netEarnings: -payload.amount,
      status: 'PAID_OUT',
    };

    localStorage.setItem('educonnect_tutor_earnings_breakdown', JSON.stringify([withdrawEntry, ...current]));

    return { success: true, newBalance };
  },
};
