import { Account } from "../main/account";
import { PrinterService } from "../main/Printer";
import {
  TransactionRepository,
  TransactionRepositoryService,
} from "../main/transactionRepository";
import { CalendarService } from "../main/calendar";

describe("Acceptance test", () => {
  const printer: PrinterService = { print: jest.fn() };
  const transactionRepository: TransactionRepositoryService =
    new TransactionRepository();
  const calendar: jest.Mocked<CalendarService> = { getDate: jest.fn() };

  it("should", () => {
    const accountService = new Account(
      transactionRepository,
      calendar,
      printer
    );

    calendar.getDate.mockReturnValueOnce("10/01/2012");
    accountService.deposit(1000);
    calendar.getDate.mockReturnValueOnce("13/01/2012");
    accountService.deposit(2000);
    calendar.getDate.mockReturnValueOnce("14/01/2012");
    accountService.withdrawal(500);
    accountService.printStatement();

    expect(printer.print).toBeCalledWith(`Date       || Amount || Balance
14/01/2012 || -500 || 2500
13/01/2012 || 2000 || 3000
10/01/2012 || 1000 || 1000`);
  });
});
