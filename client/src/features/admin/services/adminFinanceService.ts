export interface AdminWallet {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  balance: number;
  inEscrow: number;
  totalWithdrawn: number;
  currency: string;
  updatedAt: string;
}

export interface AdminTransaction {
  id: string;
  type: 'DEPOSIT' | 'BOOKING_PAYMENT' | 'CLASS_PAYMENT' | 'COMMISSION' | 'WITHDRAWAL' | 'REFUND' | 'DISPUTE_REFUND';
  amount: number;
  userId: string;
  userName: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor?: string;
  userName: string;
  action: string;
  target?: string;
  details: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL' | 'info' | 'warning' | 'danger';
  ipAddress?: string;
}

export type AdminAuditLog = AuditLog;

export interface AdminSystemSettings {
  siteName: string;
  supportEmail: string;
  commissionRate: number;
  minimumWithdrawal: number;
  autoApproveTutors: boolean;
  maintenanceMode: boolean;
  currency: string;
  platformCommissionPercentage?: number;
  minimumWithdrawalAmount?: number;
}

export type AdminGlobalSettings = AdminSystemSettings;

const DEFAULT_WALLETS: AdminWallet[] = [
  { id: 'wal_01', userId: 'usr_002', userName: 'Dra. Elena Rostova', userEmail: 'elena.rostova@educonnect.com', userRole: 'tutor', balance: 480.00, inEscrow: 56.25, totalWithdrawn: 1200.00, currency: 'USD', updatedAt: '2026-09-20' },
  { id: 'wal_02', userId: 'usr_004', userName: 'Ing. Carlos Mendoza', userEmail: 'carlos.mendoza@example.com', userRole: 'tutor', balance: 245.00, inEscrow: 0.00, totalWithdrawn: 850.00, currency: 'USD', updatedAt: '2026-09-19' },
  { id: 'wal_03', userId: 'usr_003', userName: 'Mateo González', userEmail: 'mateo.gonzalez@example.com', userRole: 'student', balance: 67.50, inEscrow: 25.00, totalWithdrawn: 0.00, currency: 'USD', updatedAt: '2026-09-20' },
  { id: 'wal_04', userId: 'usr_007', userName: 'Valeria Mendoza', userEmail: 'valeria.m@example.com', userRole: 'student', balance: 45.00, inEscrow: 37.50, totalWithdrawn: 0.00, currency: 'USD', updatedAt: '2026-09-18' },
];

const DEFAULT_TRANSACTIONS: AdminTransaction[] = [
  { id: 'tx_adm_01', type: 'DEPOSIT', amount: 50.00, userId: 'usr_003', userName: 'Mateo González', description: 'Recarga tarjeta de crédito', status: 'COMPLETED', createdAt: '2026-09-20 01:05' },
  { id: 'tx_adm_02', type: 'CLASS_PAYMENT', amount: 25.00, userId: 'usr_003', userName: 'Mateo González', description: 'Pago de clase: Cálculo Diferencial', status: 'COMPLETED', createdAt: '2026-09-19 10:15' },
  { id: 'tx_adm_03', type: 'COMMISSION', amount: 2.50, userId: 'usr_002', userName: 'Dra. Elena Rostova', description: 'Comisión EduConnect (15%) por sesión #bk_001', status: 'COMPLETED', createdAt: '2026-09-19 10:15' },
  { id: 'tx_adm_04', type: 'WITHDRAWAL', amount: 150.00, userId: 'usr_002', userName: 'Dra. Elena Rostova', description: 'Transferencia bancaria internacional BBVA', status: 'COMPLETED', createdAt: '2026-09-15 16:30' },
  { id: 'tx_adm_05', type: 'DISPUTE_REFUND', amount: 35.00, userId: 'usr_001', userName: 'Mateo González', description: 'Resolución arbitral de disputa #bk_admin_004', status: 'COMPLETED', createdAt: '2026-09-18 11:20' },
];

const DEFAULT_LOGS: AuditLog[] = [
  { id: 'log_1', timestamp: '2026-09-20 02:45:10', actor: 'admin@educonnect.com', userName: 'Super Administrador', action: 'TUTOR_APPROVED', target: 'Dra. Elena Rostova (usr_002)', details: 'Validación de títulos académicos y cédula profesional completada.', severity: 'INFO', ipAddress: '190.158.42.11' },
  { id: 'log_2', timestamp: '2026-09-20 01:12:04', actor: 'system', userName: 'Sistema Automatizado', action: 'COMMISSION_ACCREDITED', target: 'Bóveda de Plataforma (+$2.50)', details: 'Comisión liquidada y transferida a la cuenta matriz.', severity: 'INFO', ipAddress: '127.0.0.1' },
  { id: 'log_3', timestamp: '2026-09-19 18:22:30', actor: 'admin@educonnect.com', userName: 'Super Administrador', action: 'USER_BANNED', target: 'Rodrigo Spam (usr_005)', details: 'Suspención de cuenta por intento reiterado de fraude.', severity: 'CRITICAL', ipAddress: '190.158.42.11' },
  { id: 'log_4', timestamp: '2026-09-18 11:25:00', actor: 'admin@educonnect.com', userName: 'Super Administrador', action: 'DISPUTE_RESOLVED', target: 'Reserva #bk_admin_004', details: 'Reembolso total al estudiante tras peritaje técnico de conexión.', severity: 'WARN', ipAddress: '190.158.42.11' },
];

const DEFAULT_SETTINGS: AdminSystemSettings = {
  siteName: 'EduConnect Global',
  supportEmail: 'soporte@educonnect.com',
  commissionRate: 15.0,
  minimumWithdrawal: 20.0,
  autoApproveTutors: false,
  maintenanceMode: false,
  currency: 'USD',
  platformCommissionPercentage: 15.0,
  minimumWithdrawalAmount: 20.0,
};

export const adminFinanceService = {
  async getWallets(): Promise<AdminWallet[]> {
    const saved = localStorage.getItem('educonnect_admin_wallets');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    localStorage.setItem('educonnect_admin_wallets', JSON.stringify(DEFAULT_WALLETS));
    return DEFAULT_WALLETS;
  },

  async getTransactions(): Promise<AdminTransaction[]> {
    const saved = localStorage.getItem('educonnect_admin_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    localStorage.setItem('educonnect_admin_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
    return DEFAULT_TRANSACTIONS;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const saved = localStorage.getItem('educonnect_admin_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    localStorage.setItem('educonnect_admin_logs', JSON.stringify(DEFAULT_LOGS));
    return DEFAULT_LOGS;
  },

  async getSettings(): Promise<AdminSystemSettings> {
    const saved = localStorage.getItem('educonnect_admin_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    localStorage.setItem('educonnect_admin_settings', JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },

  async updateSettings(settings: AdminSystemSettings): Promise<AdminSystemSettings> {
    const updated = {
      ...settings,
      platformCommissionPercentage: settings.commissionRate,
      minimumWithdrawalAmount: settings.minimumWithdrawal
    };
    localStorage.setItem('educonnect_admin_settings', JSON.stringify(updated));
    return updated;
  },

  async getGlobalSettings(): Promise<AdminGlobalSettings> {
    return this.getSettings();
  },

  async updateGlobalSettings(settings: AdminGlobalSettings): Promise<void> {
    await this.updateSettings(settings);
  },
};
