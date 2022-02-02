class Transaction {
  constructor(amount, balance) {
    this.date = new Date();
    this.fee = 0.2;
    this.notes = this.countNotes(amount);
    this.amount = amount;
    this.balance = balance;
  }

  countNotes(amount) {
    let remainder = amount;
    const notesAvailable = [100, 50, 20, 10];
    const notesArrlength = notesAvailable.length;
    const notesReturned = {
      10: 0,
      20: 0,
      50: 0,
      100: 0,
    };

    for (let i = 0; i <= notesArrlength; i++) {
      if (remainder % notesAvailable[i] == 0) {
        notesReturned[notesAvailable[i]] = remainder / notesAvailable[i];
        break;
      } else {
        notesReturned[notesAvailable[i]] = Math.floor(
          remainder / notesAvailable[i]
        );
        remainder = remainder % notesAvailable[i];
      }
    }
    return notesReturned;
  }
}

export default Transaction;
