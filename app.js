import Account from "./account.js";

const subHeading = document.getElementById("sub-heading");
const display = document.getElementById("display");

const controlInput = document.getElementById("control-input");
const keypad = document.getElementById("keypad");

const instructions = document.getElementById("instructions");
const euroIcon = document.getElementById("euro");
const lockIcon = document.getElementById("lock");

const inputDisplay = document.getElementById("inputs");
const menuDisplay = document.getElementById("menu");
const transactionDisplay = document.getElementById("transaction");
const transactionsHistoryDisplay = document.getElementById(
  "transactions-history"
);

const inputsMainMenuBtn = document.getElementById("inputs-main-menu");

const accountDetails = {
  account: null,
  amountSet: false,
  amount: 0,
  pitSet: false,
  pin: "",
};

const atmState = {
  withdrawal: false,
  options: false,
  transactions: false,
  pinVerify: false,
  withdrawalAmount: 0,
  transactionCompleted: false,
  insufficientFunds: false,
};

const createAccount = () => {
  if (!accountDetails.amountSet) {
    accountDetails.amountSet = true;
    accountDetails.amount = Number(controlInput.value);
    changeInstructions("PIN");
    changeIcon("PIN");
  } else if (accountDetails.amountSet && !accountDetails.pinSet) {
    if (controlInput.value.length != 4) {
      errorHandler("Please set a 4 digit PIN number.");
    } else {
      accountDetails.pinSet = true;
      accountDetails.pin = controlInput.value;
    }
  }
  cleanInputField();
  if (accountDetails.amountSet && accountDetails.pinSet) {
    accountDetails.account = new Account(
      accountDetails.amount,
      accountDetails.pin
    );
    atmState.options = true;
    inputsMainMenuBtn.style.display = "block";
    changeDisplay("OPTIONS");
    changeSubHeading("OPTIONS");
  }
};

const cleanInputField = () => {
  controlInput.value = "";
};

const changeIcon = (operation) => {
  if (operation == "PIN") {
    euroIcon.style.display = "none";
    lockIcon.style.display = "block";
    controlInput.setAttribute("type", "password");
  } else if (operation == "MONEY") {
    euroIcon.style.display = "block";
    lockIcon.style.display = "none";
    controlInput.setAttribute("type", "text");
    controlInput.value = "0.00";
  }
};

const displayEventHandler = (e) => {
  if (e.target.id == "enter-btn" && accountDetails.account === null) {
    createAccount();
  } else if (e.target.id == "withdrawal-btn") {
    atmState.withdrawal = true;
    atmState.options = false;
    changeDisplay("WITHDRAWAL");
    changeInstructions("WITHDRAWAL");
    changeSubHeading("WITHDRAWAL");
    changeIcon("MONEY");
  } else if (atmState.withdrawal && e.target.id == "enter-btn") {
    atmState.withdrawal = false;
    atmState.pinVerify = true;
    atmState.withdrawalAmount = controlInput.value;
    changeDisplay("PIN");
    changeInstructions("PIN_WITHDRAWAL");
    cleanInputField();
    changeIcon("PIN");
  } else if (atmState.pinVerify && e.target.id == "enter-btn") {
    pinVerify();
  } else if (atmState.transactionCompleted && e.target.id == "main-menu") {
    atmState.transactionCompleted = false;
    atmState.options = true;
    changeDisplay("OPTIONS");
    changeInstructions("OPTIONS");
    changeSubHeading("OPTIONS");
  } else if (e.target.id == "transactions") {
    atmState.options = false;
    atmState.transactions = true;
    changeSubHeading("TRANSACTIONS_HISTORY");
    changeDisplay("TRANSACTIONS_HISTORY");
    renderTransactionsHistory(accountDetails.account.completedTransactions);
  } else if (atmState.transactions && e.target.id == "main-menu") {
    atmState.transactions = false;
    atmState.options = true;
    changeDisplay("OPTIONS");
    changeInstructions("OPTIONS");
    changeSubHeading("OPTIONS");
  } else if (
    atmState.insufficientFunds &&
    atmState.withdrawal &&
    e.target.id == "inputs-main-menu"
  ) {
    atmState.insufficientFunds = false;
    atmState.withdrawal = false;
    atmState.options = true;
    changeDisplay("OPTIONS");
    changeInstructions("OPTIONS");
    changeSubHeading("OPTIONS");
  } else if (atmState.withdrawal && e.target.id == "inputs-main-menu") {
    atmState.withdrawal = false;
    atmState.options = true;
    changeDisplay("OPTIONS");
    changeInstructions("OPTIONS");
    changeSubHeading("OPTIONS");
  }
  else if (atmState.pinVerify && e.target.id == "inputs-main-menu") {
    atmState.pinVerify = false;
    atmState.options = true;
    changeDisplay("OPTIONS");
    changeInstructions("OPTIONS");
    changeSubHeading("OPTIONS");
  }
  console.log(atmState)
};

const pinVerify = () => {
  if (controlInput.value == accountDetails.account.pin) {
    atmState.pinVerify = false;
    atmState.withdrawal = true;
    withdrawalHandler();
  } else {
    errorHandler("Incorrect PIN number.");
    cleanInputField();
  }
};

const changeDisplay = (operation) => {
  if (operation == "OPTIONS") {
    transactionsHistoryDisplay.style.display = "none";
    inputDisplay.style.display = "none";
    transactionDisplay.style.display = "none";
    menuDisplay.style.display = "flex";
  } else if (operation == "WITHDRAWAL") {
    transactionDisplay.style.display = "none";
    menuDisplay.style.display = "none";
    inputDisplay.style.display = "flex";
  } else if (operation == "TRANSACTION") {
    inputDisplay.style.display = "none";
    transactionDisplay.style.display = "flex";
  } else if (operation == "PIN") {
    transactionDisplay.style.display = "none";
    inputDisplay.style.display = "flex";
  } else if (operation == "TRANSACTIONS_HISTORY") {
    menuDisplay.style.display = "none";
    transactionsHistoryDisplay.style.display = "flex";
  }
};

const changeInstructions = (operation) => {
  if (operation == "PIN") {
    instructions.innerText = "Please set a 4 digit PIN number.";
  } else if (operation == "WITHDRAWAL")
    instructions.innerText = "Please enter the withdrawal amount.";
  else if (operation == "PIN_WITHDRAWAL") {
    instructions.innerText = "Please enter your PIN number.";
  }
};

const changeSubHeading = (operation) => {
  if (operation == "OPTIONS") {
    subHeading.innerText = "Please select an option";
  } else if (operation == "WITHDRAWAL") {
    subHeading.innerText = "Follow the instructions below";
  } else if (operation == "TRANSACTION") {
    subHeading.innerText = "Transaction completed";
  } else if (operation == "TRANSACTIONS_HISTORY") {
    subHeading.innerText = "Transactions history";
  }
};

const enterInput = (e) => {
  if (controlInput.value == "0.00") {
    cleanInputField();
  }
  if (e.target.className == "key-outter" && e.target.id != "backspace") {
    controlInput.value += e.target.children[0].innerText;
  } else if (e.target.className == "key" && e.target.innerText != "") {
    controlInput.value += e.target.innerText;
  } else if (e.target.id == "backspace" || e.target.innerText == "") {
    controlInput.value = controlInput.value.slice(
      0,
      controlInput.value.length - 1
    );
  }
};

const errorHandler = (error) => {
  instructions.innerText = error;
};

const withdrawalHandler = () => {
  const amount = atmState.withdrawalAmount;
  try {
    const transaction = accountDetails.account.withdrawal(amount);
    changeSubHeading("TRANSACTION");
    changeDisplay("TRANSACTION");
    renderTransaction(transaction);
    atmState.transactionCompleted = true;
    atmState.withdrawal = false;
    atmState.withdrawalAmount = 0;
  } catch (error) {
    atmState.withdrawalAmount = 0;
    atmState.insufficientFunds = true;
    errorHandler(error.message);
    changeIcon("MONEY");
    controlInput.value = "0.00";
  }
};

const renderTransaction = (transaction) => {
  const [day, month, date, year, hour] = transaction.date.toString().split(" ");
  const notes = `${transaction.notes[100]}x100, ${transaction.notes[50]}x50, ${transaction.notes[20]}x20, ${transaction.notes[10]}x10`;
  document.getElementById(
    "date"
  ).innerText = `${date} ${month} ${year} at ${hour}`;
  document.getElementById("amount-withdrawn").innerText = transaction.amount;
  document.getElementById("notes-dispensed").innerText = notes;
  document.getElementById("balance").innerText = transaction.balance.toFixed(2);
  document.getElementById("fee").innerText = transaction.fee.toFixed(2);
};

const renderTransactionsHistory = (transactions) => {
  let btn = document.createElement("button");
  btn.id = "main-menu";
  btn.className = "button";
  btn.innerText = "Main Menu";
  if (transactions.length == 0) {
    transactionsHistoryDisplay.innerHTML = "";
    let p = document.createElement("p");
    p.innerText = "No history available.";
    transactionsHistoryDisplay.prepend(p);
    transactionsHistoryDisplay.append(btn);
  } else {
    transactionsHistoryDisplay.innerHTML = "";
    for (let transaction of transactions) {
      const [day, month, date, year, hour] = transaction.date
        .toString()
        .split(" ");
      let li = document.createElement("li");
      li.innerHTML = `<li class="transactions-wrapper">
      <p>Date : <span id="date">${date} ${month} ${year} at ${hour}</span> </p>
      <p>Amount withdrawn : <span id="amount-withdrawn">${
        transaction.amount
      }</span> leva</p>
      <p>Fee charged : <span id="fee">${transaction.fee.toFixed(
        2
      )}</span> leva</p>
      <p>Balance left : <span id="balance">${transaction.balance.toFixed(
        2
      )}</span> leva</p>
  </li>`;
      transactionsHistoryDisplay.prepend(li);
    }
    transactionsHistoryDisplay.append(btn);
  }
};

keypad.addEventListener("click", enterInput);
display.addEventListener("click", displayEventHandler);
