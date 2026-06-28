import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type AccountReportRow = {
  id: string;
  code: string;
  name: string;
  type: string;
  totalDebitCents: number;
  totalCreditCents: number;
  balanceCents: number;
};

@Injectable()
export class AccountingService {
  constructor(private readonly prisma: PrismaService) {}

  private getAccountCode(account: any): string {
    return account.code ?? account.accountCode ?? account.accountNumber ?? '';
  }

  private getEntryAccountId(entry: any): string {
    return entry.ledgerAccountId ?? entry.accountId ?? '';
  }

  private getEntryTransactionId(entry: any): string {
    return entry.ledgerTransactionId ?? entry.transactionId ?? '';
  }

  private calculateNormalBalance(
    accountType: string,
    debitCents: number,
    creditCents: number,
  ): number {
    if (accountType === 'ASSET' || accountType === 'EXPENSE') {
      return debitCents - creditCents;
    }

    return creditCents - debitCents;
  }

  private async buildAccountRows(): Promise<AccountReportRow[]> {
    const accounts = (await this.prisma.ledgerAccount.findMany()) as any[];
    const entries = (await this.prisma.ledgerEntry.findMany()) as any[];

    const rowsMap = new Map<string, AccountReportRow>();

    for (const account of accounts) {
      rowsMap.set(account.id, {
        id: account.id,
        code: this.getAccountCode(account),
        name: account.name,
        type: String(account.type),
        totalDebitCents: 0,
        totalCreditCents: 0,
        balanceCents: 0,
      });
    }

    for (const entry of entries) {
      const accountId = this.getEntryAccountId(entry);

      if (!rowsMap.has(accountId)) {
        rowsMap.set(accountId, {
          id: accountId,
          code: '',
          name: 'Unknown Account',
          type: 'UNKNOWN',
          totalDebitCents: 0,
          totalCreditCents: 0,
          balanceCents: 0,
        });
      }

      const row = rowsMap.get(accountId)!;
      row.totalDebitCents += entry.debitCents ?? 0;
      row.totalCreditCents += entry.creditCents ?? 0;
    }

    const rows = Array.from(rowsMap.values());

    for (const row of rows) {
      row.balanceCents = this.calculateNormalBalance(
        row.type,
        row.totalDebitCents,
        row.totalCreditCents,
      );
    }

    return rows.sort((a, b) => a.code.localeCompare(b.code));
  }

  async getTrialBalance() {
    const rows = await this.buildAccountRows();

    const totalDebitCents = rows.reduce(
      (sum, row) => sum + row.totalDebitCents,
      0,
    );

    const totalCreditCents = rows.reduce(
      (sum, row) => sum + row.totalCreditCents,
      0,
    );

    return {
      reportName: 'Trial Balance',
      generatedAt: new Date().toISOString(),
      totalDebitCents,
      totalCreditCents,
      isBalanced: totalDebitCents === totalCreditCents,
      accounts: rows,
    };
  }

  async getIncomeStatement() {
    const rows = await this.buildAccountRows();

    const revenueAccounts = rows.filter(
      (row) => row.type === 'REVENUE' || row.type === 'INCOME',
    );

    const expenseAccounts = rows.filter((row) => row.type === 'EXPENSE');

    const totalRevenueCents = revenueAccounts.reduce(
      (sum, row) => sum + row.balanceCents,
      0,
    );

    const totalExpenseCents = expenseAccounts.reduce(
      (sum, row) => sum + row.balanceCents,
      0,
    );

    const netIncomeCents = totalRevenueCents - totalExpenseCents;

    return {
      reportName: 'Income Statement',
      generatedAt: new Date().toISOString(),
      totalRevenueCents,
      totalExpenseCents,
      netIncomeCents,
      revenueAccounts,
      expenseAccounts,
    };
  }

  async getBalanceSheet() {
    const rows = await this.buildAccountRows();
    const incomeStatement = await this.getIncomeStatement();

    const assetAccounts = rows.filter((row) => row.type === 'ASSET');
    const liabilityAccounts = rows.filter((row) => row.type === 'LIABILITY');
    const equityAccounts = rows.filter((row) => row.type === 'EQUITY');

    const totalAssetsCents = assetAccounts.reduce(
      (sum, row) => sum + row.balanceCents,
      0,
    );

    const totalLiabilitiesCents = liabilityAccounts.reduce(
      (sum, row) => sum + row.balanceCents,
      0,
    );

    const totalEquityCents = equityAccounts.reduce(
      (sum, row) => sum + row.balanceCents,
      0,
    );

    const retainedEarningsCents = incomeStatement.netIncomeCents;

    return {
      reportName: 'Balance Sheet',
      generatedAt: new Date().toISOString(),
      totalAssetsCents,
      totalLiabilitiesCents,
      totalEquityCents,
      retainedEarningsCents,
      liabilitiesAndEquityCents:
        totalLiabilitiesCents + totalEquityCents + retainedEarningsCents,
      assetAccounts,
      liabilityAccounts,
      equityAccounts,
    };
  }

  async getWalletSummary() {
    const wallets = (await this.prisma.wallet.findMany()) as any[];

    const totalBalanceCents = wallets.reduce(
      (sum, wallet) => sum + (wallet.balanceCents ?? 0),
      0,
    );

    return {
      reportName: 'Wallet Summary',
      generatedAt: new Date().toISOString(),
      walletCount: wallets.length,
      totalBalanceCents,
      wallets,
    };
  }

  async getLedgerSummary() {
    const transactions = (await this.prisma.ledgerTransaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })) as any[];

    const entries = (await this.prisma.ledgerEntry.findMany()) as any[];

    const transactionsWithTotals = transactions.map((transaction) => {
      const transactionEntries = entries.filter(
        (entry) => this.getEntryTransactionId(entry) === transaction.id,
      );

      const totalDebitCents = transactionEntries.reduce(
        (sum, entry) => sum + (entry.debitCents ?? 0),
        0,
      );

      const totalCreditCents = transactionEntries.reduce(
        (sum, entry) => sum + (entry.creditCents ?? 0),
        0,
      );

      return {
        ...transaction,
        totalDebitCents,
        totalCreditCents,
        isBalanced: totalDebitCents === totalCreditCents,
      };
    });

    return {
      reportName: 'Ledger Summary',
      generatedAt: new Date().toISOString(),
      transactionCount: transactions.length,
      entryCount: entries.length,
      transactions: transactionsWithTotals,
    };
  }
}
