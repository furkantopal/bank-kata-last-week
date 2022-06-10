import { Account } from "../main/account";
import {
  TransactionRepository,
  TransactionRepositoryService,
} from "../main/transactionRepository";
import { CalendarService } from "../main/calendar";
import Mocked = jest.Mocked;
import { PrinterService } from "../main/Printer";

describe("Account Service", () => {
  const transactionRepository: Mocked<TransactionRepositoryService> = {
    save: jest.fn(),
    getTransactions: jest.fn(),
  };
  const calendar: Mocked<CalendarService> = { getDate: jest.fn() };
  const printer: Mocked<PrinterService> = { print: jest.fn() };

  describe("deposit", () => {
    it("should deposit 1000", () => {
      calendar.getDate.mockReturnValueOnce("14/01/2012");

      const accountService = new Account(
        transactionRepository,
        calendar,
        printer
      );
      accountService.deposit(1000);
      expect(transactionRepository.save).toBeCalledWith({
        date: "14/01/2012",
        amount: 1000,
      });
    });

    it("should deposit 2000 on the 15/02/2013", () => {
      calendar.getDate.mockReturnValueOnce("15/02/2013");
      const accountService = new Account(
        transactionRepository,
        calendar,
        printer
      );

      accountService.deposit(2000);

      expect(transactionRepository.save).toBeCalledWith({
        date: "15/02/2013",
        amount: 2000,
      });
    });
  });
  describe("withdraw", () => {
    it("withdraw 500", () => {
      calendar.getDate.mockReturnValueOnce("14/01/2012");
      const account = new Account(transactionRepository, calendar, printer);

      account.withdrawal(500);

      expect(transactionRepository.save).toBeCalledWith({
        date: "14/01/2012",
        amount: -500,
      });
    });
  });

  describe("printStatement", () => {
    it("should print an empty statement", () => {
      transactionRepository.getTransactions.mockReturnValueOnce([]);
      const account = new Account(transactionRepository, calendar, printer);

      account.printStatement();

      expect(printer.print).toBeCalledWith(`Date       || Amount || Balance`);
    });

    it("should print a statement with a deposit", () => {
      transactionRepository.getTransactions.mockReturnValueOnce([
        { date: "15/02/2013", amount: 1000 },
      ]);
      const account = new Account(transactionRepository, calendar, printer);

      account.printStatement();

      expect(printer.print).toBeCalledWith(`Date       || Amount || Balance
15/02/2013 || 1000 || 1000`);
    });

    it("should print a statement with a deposit on a different day and different amount", () => {
      transactionRepository.getTransactions.mockReturnValueOnce([
        { date: "16/02/2013", amount: 2000 },
      ]);
      const account = new Account(transactionRepository, calendar, printer);

      account.printStatement();

      expect(printer.print).toBeCalledWith(`Date       || Amount || Balance
16/02/2013 || 2000 || 2000`);
    });

    it("should print more than one deposit", () => {
      transactionRepository.getTransactions.mockReturnValueOnce([
        { date: "10/01/2012", amount: 1000 },
        { date: "13/01/2012", amount: 2000 },
      ]);
      const account = new Account(transactionRepository, calendar, printer);

      account.printStatement();

      expect(printer.print).toBeCalledWith(`Date       || Amount || Balance
13/01/2012 || 2000 || 3000
10/01/2012 || 1000 || 1000`);
    });
  });

  describe("Repository", () => {
    it("should return empty array when there is no transaction in the repository", () => {
      const transactionRepository = new TransactionRepository();
      expect(transactionRepository.getTransactions()).toEqual([]);
    });

    it("should save transaction into the repository", () => {
      const transactionRepository = new TransactionRepository();
      transactionRepository.save({ date: "14/01/2012", amount: 1000 });

      expect(transactionRepository.getTransactions()[0]).toEqual({
        date: "14/01/2012",
        amount: 1000,
      });
    });
  });
});
