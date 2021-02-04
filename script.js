'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
let inputTransferTo = document.querySelector('.form__input--to');
let inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // delete elements already there
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // create a copy - not to change the original array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} $</div>
        </div>
    `;
    // (position added to, string containing the html we want to insert)
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;
const movementsUSD = movements.map(function (mov) {
  return mov * eurToUsd;
});

const createUN = function (user) {
  user.forEach(function (acc) {
    acc.username = acc.owner // create an instance for the account object: username
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUN(accounts);
// console.log(accounts);
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
// accumulator = SNOWBALL
const printBalance = function (acc) {
  // store the permanent balance in the ACCOUNT object
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0); // starts at 0
  labelBalance.textContent = `${acc.balance} EUR`;
};

const displaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .map((mov, i, arr) => {
      // check if array is correct
      return mov;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}e`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .map((mov, i, arr) => mov)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${out}e`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}e`;
};

// maximum value
const max = movements.reduce(function (acc, cur) {
  return function () {
    if (acc > cur) return acc;
    else return cur;
  };
}, movements[0]);

// PIPELINE
const totalDeposit = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    console.log(arr); // check if array is correct
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);

/////////////////////////////////////////////////
// return the first element that satisfies the condition
// FILTER returns a new array
const firstWithdrawal = movements.find(mov => mov < 0);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);
  // display balance
  printBalance(acc);
  // display summary
  displaySummary(acc);
};
// Event handler
let currentAccount; // <-- other functions can access
btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting & page reloading
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // if the current account exists => does not show error
  if (!currentAccount || currentAccount.pin != inputLoginPin.value) {
    alert('wrong input!');
    inputLoginUsername.value = inputLoginPin.value = '';
  } else {
    if (currentAccount.pin === Number(inputLoginPin.value)) {
      // display UI & welcome message
      labelWelcome.textContent = `Welcome back, ${
        currentAccount.owner.split(' ')[0]
      }`;
      containerApp.style.opacity = 100;
      // clear the input fields
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
      updateUI(currentAccount);
    }
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  if (
    amount < 0 ||
    amount > currentAccount.balance ||
    receiverAcc?.username === currentAccount.username ||
    !receiverAcc
  ) {
    alert('invalid input');
  } else {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
    updateUI(receiverAcc);
    console.log(currentAccount, receiverAcc);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value !== currentAccount.username ||
    Number(inputClosePin.value) !== currentAccount.pin
  ) {
    alert('invalid input');
  } else {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1); //array.splice(index, howmany, item1, ....., itemX) - delete acc
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount < 0 ||
    !currentAccount.movements.some(mov => mov >= amount * 0.1)
  ) {
    alert('invalid output');
  } else {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
// sum of all movements from all IDs
const allMovs = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(allMovs);

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movement__value'),
    el => Number(el.textContent.replace('$', ''))
  );
});
