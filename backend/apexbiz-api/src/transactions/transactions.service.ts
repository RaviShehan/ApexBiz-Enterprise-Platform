import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  LedgerAccountType,
  Prisma,
  WalletStatus,
  WalletTransactionType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureWalletLedgerAccount(
    tx: Prisma.TransactionClient,
    walletId: string,
  ) {
    const wallet = await tx.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.status !== WalletStatus.ACTIVE) {
      throw new BadRequestException('Wallet is not active');
    }

    const accountCode = `WALLET-${wallet.walletCode}`;

    let account = await tx.ledgerAccount.findUnique({
      where: { code: accountCode },
    });

    if (!account) {
      account = await tx.ledgerAccount.create({
        data: {
          code: accountCode,
          name: `${wallet.walletCode} Ledger Account`,
          type: LedgerAccountType.ASSET,
          walletId: wallet.id,
          description: 'Auto-created wallet ledger account',
        },
      });
    }

    return {
      wallet,
      account,
    };
  }

  private async ensureSystemAccount(
    tx: Prisma.TransactionClient,
    code: string,
    name: string,
    type: LedgerAccountType,
  ) {
    let account = await tx.ledgerAccount.findUnique({
      where: { code },
    });

    if (!account) {
      account = await tx.ledgerAccount.create({
        data: {
          code,
          name,
          type,
          description: 'Auto-created system ledger account',
        },
      });
    }

    return account;
  }

  async create(createDto: CreateWalletTransactionDto) {
    const existingTransaction = await this.prisma.walletTransaction.findUnique({
      where: {
        reference: createDto.reference,
      },
    });

    if (existingTransaction) {
      throw new BadRequestException('Transaction reference already exists');
    }

    if (createDto.type === WalletTransactionType.DEPOSIT) {
      return this.createDeposit(createDto);
    }

    if (createDto.type === WalletTransactionType.WITHDRAWAL) {
      return this.createWithdrawal(createDto);
    }

    if (createDto.type === WalletTransactionType.TRANSFER) {
      return this.createTransfer(createDto);
    }

    throw new BadRequestException('Unsupported transaction type');
  }

  private async createDeposit(createDto: CreateWalletTransactionDto) {
    if (!createDto.destinationWalletId) {
      throw new BadRequestException('destinationWalletId is required for deposit');
    }

    return this.prisma.$transaction(async (tx) => {
      const { wallet, account: walletAccount } =
        await this.ensureWalletLedgerAccount(tx, createDto.destinationWalletId!);

      const systemAccount = await this.ensureSystemAccount(
        tx,
        'SYSTEM-DEPOSIT-SOURCE',
        'System Deposit Source',
        LedgerAccountType.LIABILITY,
      );

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceCents: {
            increment: createDto.amountCents,
          },
        },
      });

      const ledgerTransaction = await tx.ledgerTransaction.create({
        data: {
          reference: `LEDGER-${createDto.reference}`,
          description: createDto.description ?? 'Wallet deposit',
          entries: {
            create: [
              {
                accountId: walletAccount.id,
                debitCents: createDto.amountCents,
                creditCents: 0,
                memo: 'Wallet balance increased',
              },
              {
                accountId: systemAccount.id,
                debitCents: 0,
                creditCents: createDto.amountCents,
                memo: 'Deposit source recorded',
              },
            ],
          },
        },
        include: {
          entries: true,
        },
      });

      const walletTransaction = await tx.walletTransaction.create({
        data: {
          reference: createDto.reference,
          type: WalletTransactionType.DEPOSIT,
          amountCents: createDto.amountCents,
          currency: wallet.currency,
          destinationWalletId: wallet.id,
          ledgerTransactionId: ledgerTransaction.id,
          description: createDto.description,
        },
        include: {
          sourceWallet: true,
          destinationWallet: true,
          ledgerTransaction: {
            include: {
              entries: true,
            },
          },
        },
      });

      return {
        message: 'Deposit completed successfully',
        wallet: updatedWallet,
        transaction: walletTransaction,
      };
    });
  }

  private async createWithdrawal(createDto: CreateWalletTransactionDto) {
    if (!createDto.sourceWalletId) {
      throw new BadRequestException('sourceWalletId is required for withdrawal');
    }

    return this.prisma.$transaction(async (tx) => {
      const { wallet, account: walletAccount } =
        await this.ensureWalletLedgerAccount(tx, createDto.sourceWalletId!);

      if (wallet.balanceCents < createDto.amountCents) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      const systemAccount = await this.ensureSystemAccount(
        tx,
        'SYSTEM-WITHDRAWAL-DESTINATION',
        'System Withdrawal Destination',
        LedgerAccountType.ASSET,
      );

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceCents: {
            decrement: createDto.amountCents,
          },
        },
      });

      const ledgerTransaction = await tx.ledgerTransaction.create({
        data: {
          reference: `LEDGER-${createDto.reference}`,
          description: createDto.description ?? 'Wallet withdrawal',
          entries: {
            create: [
              {
                accountId: systemAccount.id,
                debitCents: createDto.amountCents,
                creditCents: 0,
                memo: 'Withdrawal destination recorded',
              },
              {
                accountId: walletAccount.id,
                debitCents: 0,
                creditCents: createDto.amountCents,
                memo: 'Wallet balance decreased',
              },
            ],
          },
        },
        include: {
          entries: true,
        },
      });

      const walletTransaction = await tx.walletTransaction.create({
        data: {
          reference: createDto.reference,
          type: WalletTransactionType.WITHDRAWAL,
          amountCents: createDto.amountCents,
          currency: wallet.currency,
          sourceWalletId: wallet.id,
          ledgerTransactionId: ledgerTransaction.id,
          description: createDto.description,
        },
        include: {
          sourceWallet: true,
          destinationWallet: true,
          ledgerTransaction: {
            include: {
              entries: true,
            },
          },
        },
      });

      return {
        message: 'Withdrawal completed successfully',
        wallet: updatedWallet,
        transaction: walletTransaction,
      };
    });
  }

  private async createTransfer(createDto: CreateWalletTransactionDto) {
    if (!createDto.sourceWalletId) {
      throw new BadRequestException('sourceWalletId is required for transfer');
    }

    if (!createDto.destinationWalletId) {
      throw new BadRequestException('destinationWalletId is required for transfer');
    }

    if (createDto.sourceWalletId === createDto.destinationWalletId) {
      throw new BadRequestException('Source and destination wallets must be different');
    }

    return this.prisma.$transaction(async (tx) => {
      const { wallet: sourceWallet, account: sourceAccount } =
        await this.ensureWalletLedgerAccount(tx, createDto.sourceWalletId!);

      const { wallet: destinationWallet, account: destinationAccount } =
        await this.ensureWalletLedgerAccount(tx, createDto.destinationWalletId!);

      if (sourceWallet.currency !== destinationWallet.currency) {
        throw new BadRequestException('Wallet currencies must match');
      }

      if (sourceWallet.balanceCents < createDto.amountCents) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      const updatedSourceWallet = await tx.wallet.update({
        where: { id: sourceWallet.id },
        data: {
          balanceCents: {
            decrement: createDto.amountCents,
          },
        },
      });

      const updatedDestinationWallet = await tx.wallet.update({
        where: { id: destinationWallet.id },
        data: {
          balanceCents: {
            increment: createDto.amountCents,
          },
        },
      });

      const ledgerTransaction = await tx.ledgerTransaction.create({
        data: {
          reference: `LEDGER-${createDto.reference}`,
          description: createDto.description ?? 'Wallet transfer',
          entries: {
            create: [
              {
                accountId: destinationAccount.id,
                debitCents: createDto.amountCents,
                creditCents: 0,
                memo: 'Destination wallet increased',
              },
              {
                accountId: sourceAccount.id,
                debitCents: 0,
                creditCents: createDto.amountCents,
                memo: 'Source wallet decreased',
              },
            ],
          },
        },
        include: {
          entries: true,
        },
      });

      const walletTransaction = await tx.walletTransaction.create({
        data: {
          reference: createDto.reference,
          type: WalletTransactionType.TRANSFER,
          amountCents: createDto.amountCents,
          currency: sourceWallet.currency,
          sourceWalletId: sourceWallet.id,
          destinationWalletId: destinationWallet.id,
          ledgerTransactionId: ledgerTransaction.id,
          description: createDto.description,
        },
        include: {
          sourceWallet: true,
          destinationWallet: true,
          ledgerTransaction: {
            include: {
              entries: true,
            },
          },
        },
      });

      return {
        message: 'Transfer completed successfully',
        sourceWallet: updatedSourceWallet,
        destinationWallet: updatedDestinationWallet,
        transaction: walletTransaction,
      };
    });
  }

  async findAll() {
    return this.prisma.walletTransaction.findMany({
      include: {
        sourceWallet: true,
        destinationWallet: true,
        ledgerTransaction: {
          include: {
            entries: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { id },
      include: {
        sourceWallet: true,
        destinationWallet: true,
        ledgerTransaction: {
          include: {
            entries: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Wallet transaction not found');
    }

    return transaction;
  }
}
