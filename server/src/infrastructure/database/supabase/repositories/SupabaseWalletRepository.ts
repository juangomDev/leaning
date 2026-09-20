import { IWalletRepository } from '../../../../domain/wallet/WalletRepository.js';
import { Wallet } from '../../../../domain/wallet/Wallet.js';
import { WalletTransaction } from '../../../../domain/wallet/WalletTransaction.js';
import { dbClient as supabase } from '../client.js';
import { WalletMapper } from '../mappers/WalletMapper.js';

export class SupabaseWalletRepository implements IWalletRepository {
  async getBalance(userId: string): Promise<number> {
    if (!supabase) return 50.0;

    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return 0.0;
    return Number(data.balance);
  }

  async updateBalance(userId: string, newBalance: number): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase
      .from('wallets')
      .upsert({
        user_id: userId,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });

    if (error) throw new Error(error.message);
  }

  async addTransaction(transaction: WalletTransaction): Promise<WalletTransaction> {
    if (!supabase) return transaction;

    const txRow = WalletMapper.toTransactionRow(transaction);
    const { error: txError } = await supabase.from('wallet_transactions').insert({
      id: txRow.id,
      wallet_id: txRow.wallet_id,
      user_id: txRow.user_id,
      booking_id: txRow.booking_id,
      amount: txRow.amount,
      type: txRow.type,
      concept: txRow.concept,
      status: txRow.status,
      created_at: txRow.created_at,
    });

    if (txError) throw new Error(txError.message);

    const currentBalance = await this.getBalance(transaction.userId);
    await this.updateBalance(transaction.userId, currentBalance + transaction.amount);

    return transaction;
  }

  async getTransactions(userId: string): Promise<WalletTransaction[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((row: any) => WalletMapper.toTransactionDomain(row));
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return WalletMapper.toDomain(data);
  }

  async saveWallet(wallet: Wallet): Promise<void> {
    if (!supabase) return;

    const row = WalletMapper.toRow(wallet);
    const { error } = await supabase.from('wallets').upsert({
      id: wallet.id,
      user_id: row.user_id,
      balance: row.balance,
      currency: row.currency,
      status: row.status,
      updated_at: row.updated_at,
    });

    if (error) throw new Error(error.message);
  }
}
