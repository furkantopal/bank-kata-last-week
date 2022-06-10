export interface TransactionRepositoryService {
  save(transaction: Transaction): void;
  getTransactions(): Transaction[];
}

export class TransactionRepository implements TransactionRepositoryService {
  private transactionRecords: Transaction[] = [];

  getTransactions(): Transaction[] {
    return this.transactionRecords;
  }

  save(transaction: Transaction): void {
    this.transactionRecords.push(transaction);
  }
}

export type Transaction = {
  date: string;
  amount: number;
};
