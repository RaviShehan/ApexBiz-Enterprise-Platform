import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLedgerAccountDto } from './dto/create-ledger-account.dto';
import { CreateLedgerTransactionDto } from './dto/create-ledger-transaction.dto';

@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(createLedgerAccountDto: CreateLedgerAccountDto) {
    const existingAccount = await this.prisma.ledgerAccount.findUnique({
      where: {
        code: createLedgerAccountDto.code,
      },
    });

    if (existingAccount) {
      throw new BadRequestException('Ledger account code already exists');
    }

    if (createLedgerAccountDto.walletId) {
      const wallet = await this.prisma.wallet.findUnique({
        where: {
          id: createLedgerAccountDto.walletId,
        },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }
    }

    const account = await this.prisma.ledgerAccount.create({
      data: {
        code: createLedgerAccountDto.code,
        name: createLedgerAccountDto.name,
        type: createLedgerAccountDto.type,
        walletId: createLedgerAccountDto.walletId,
        description: createLedgerAccountDto.description,
        isActive: createLedgerAccountDto.isActive ?? true,
      },
      include: {
        wallet: true,
      },
    });

    return {
      message: 'Ledger account created successfully',
      account,
    };
  }

  async findAllAccounts() {
    return this.prisma.ledgerAccount.findMany({
      include: {
        wallet: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneAccount(id: string) {
    const account = await this.prisma.ledgerAccount.findUnique({
      where: { id },
      include: {
        wallet: true,
        entries: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Ledger account not found');
    }

    return account;
  }

  private validateDoubleEntry(entries: CreateLedgerTransactionDto['entries']) {
    let totalDebit = 0;
    let totalCredit = 0;

    for (const entry of entries) {
      if (entry.debitCents > 0 && entry.creditCents > 0) {
        throw new BadRequestException(
          'A ledger entry cannot have both debit and credit amounts',
        );
      }

      if (entry.debitCents === 0 && entry.creditCents === 0) {
        throw new BadRequestException(
          'A ledger entry must have either debit or credit amount',
        );
      }

      totalDebit += entry.debitCents;
      totalCredit += entry.creditCents;
    }

    if (totalDebit !== totalCredit) {
      throw new BadRequestException(
        'Double-entry rule failed: total debit must equal total credit',
      );
    }

    if (totalDebit <= 0) {
      throw new BadRequestException(
        'Ledger transaction amount must be greater than zero',
      );
    }

    return {
      totalDebit,
      totalCredit,
    };
  }

  async createTransaction(createLedgerTransactionDto: CreateLedgerTransactionDto) {
    const existingTransaction = await this.prisma.ledgerTransaction.findUnique({
      where: {
        reference: createLedgerTransactionDto.reference,
      },
    });

    if (existingTransaction) {
      throw new BadRequestException('Ledger transaction reference already exists');
    }

    const totals = this.validateDoubleEntry(createLedgerTransactionDto.entries);

    const accountIds = createLedgerTransactionDto.entries.map(
      (entry) => entry.accountId,
    );

    const accounts = await this.prisma.ledgerAccount.findMany({
      where: {
        id: {
          in: accountIds,
        },
        isActive: true,
      },
    });

    if (accounts.length !== new Set(accountIds).size) {
      throw new BadRequestException(
        'One or more ledger accounts are invalid or inactive',
      );
    }

    const transaction = await this.prisma.ledgerTransaction.create({
      data: {
        reference: createLedgerTransactionDto.reference,
        description: createLedgerTransactionDto.description,
        entries: {
          create: createLedgerTransactionDto.entries.map((entry) => ({
            accountId: entry.accountId,
            debitCents: entry.debitCents,
            creditCents: entry.creditCents,
            memo: entry.memo,
          })),
        },
      },
      include: {
        entries: {
          include: {
            account: true,
          },
        },
      },
    });

    return {
      message: 'Ledger transaction posted successfully',
      totalDebitCents: totals.totalDebit,
      totalCreditCents: totals.totalCredit,
      transaction,
    };
  }

  async findAllTransactions() {
    return this.prisma.ledgerTransaction.findMany({
      include: {
        entries: {
          include: {
            account: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneTransaction(id: string) {
    const transaction = await this.prisma.ledgerTransaction.findUnique({
      where: { id },
      include: {
        entries: {
          include: {
            account: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Ledger transaction not found');
    }

    return transaction;
  }
}
