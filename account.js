import Transaction from "./transaction.js";

class Account {
  constructor(balance, pin) {
    this.balance = balance;
    this.pin = pin;
    this.completedTransactions = [];
    this.withdrawalLimit = 400;
  }

  set balance(value) {
    this._balance = value;
  }

  get balance() {
    return this._balance;
  }

  set pin(value) {
    this._pin = value;
  }

  get pin() {
    return this._pin;
  }

  withdrawal(value) {
    const withdrawnAmount = Number(value);
    if (withdrawnAmount + 0.2 > this.balance) {
      throw new Error(
        "Insufficient funds. Please check your balance or enter a lower amount."
      );
    } else if (value.split("")[value.length - 1] != "0") {
      throw new Error(
        `Invalid amount entered. This ATM dispenses only notes of 10 20 50 and 100 leva. Please enter a new amount.`
      );
    } else if (withdrawnAmount > this.withdrawalLimit) {
      throw new Error(
        "Single transaction limit of 400 leva exceeded. Please enter a new amount."
      );
    } else {
      this.balance -= withdrawnAmount + 0.2;
      return this.addTransaction(withdrawnAmount, this.balance);
    }
  }

  addTransaction(amount, balance) {
    const transaction = new Transaction(amount, balance);
    this.completedTransactions.push(transaction);
    return transaction;
  }
}

export default Account;
