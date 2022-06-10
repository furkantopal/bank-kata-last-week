import { TransactionRepositoryService } from "./transactionRepository";
import { CalendarService } from "./calendar";
import { PrinterService } from "./Printer";

interface AccountService {
  deposit(input: number): void;
  withdrawal(input: number): void;
  printStatement(): void;
}

export class Account implements AccountService {
  constructor(
    private transactionRepository: TransactionRepositoryService,
    private calendar: CalendarService,
    private printer: PrinterService
  ) {}

  deposit(input: number): void {
    this.transactionRepository.save({
      date: this.calendar.getDate(),
      amount: input,
    });
  }

  withdrawal(input: number): void {
    this.transactionRepository.save({
      date: this.calendar.getDate(),
      amount: -input,
    });
  }

  printStatement(): void {
    const transactions = this.transactionRepository.getTransactions();

    let printString = "Date       || Amount || Balance";
    let balance = 0;

    transactions
      .map((transaction) => {
        balance += transaction.amount;
        return `\n${transaction.date} || ${transaction.amount} || ${balance}`;
      })
      .reverse()
      .forEach((string) => {
        printString = printString + string;
      });

    this.printer.print(printString);
  }
}
