'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Abdelwahab Amged',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-09-28T17:01:17.194Z',
    '2022-09-29T01:36:17.929Z',
    '2022-09-30T10:51:36.790Z',
  ],
  currency: 'EGP',
  locale: 'ar-EG', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2022-09-28T14:43:26.374Z',
    '2022-09-29T18:49:59.371Z',
    '2022-09-30T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3];

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
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// /// //// ///// /////// ////////
// FUNCTIONS

// finction return the time that passed from the moment of movment to this day.
const formatMovementDate = function (date, locale) {
  // functon to calc the differnce between today and the day of movment
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  // once we (return) the functions stop excuting, and so these other return will never be reached.
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);

  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
};

// customized and reuseable function for currency formate for each country.
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/*  
==>we could write our code here out in the Global context, but that is not Good practice,
and it always best to creat a function for this. pass the Data into a function instead of having this function work with globale variables.
*/
// Function to show the movment array and movment dates in the UI
// and to sort the array in ascending order
const displayMovements = function (acc, sort = false) {
  // empty the container, reset the container.
  containerMovements.innerHTML = '';

  //==> Using slice to not change the underlaying array and make copy of it
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    // check the type of move
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // creating date for each movment.
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // currency formating
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // creat a new elemnt row foreach value to display it in the UI with templet letral
    const html = `        
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    // append html element to conatiner foreach value to appear in UI
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// creat function calc the value of total balance
const calcPrintBalance = function (acc) {
  // ==> save the value in new property we creat cuz we need this prop in transfer to check if the amount of mony < balance, not just making this function to put it in UI
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  // currency formating
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// function for all positive number sum & all nigative sum and interest.
// ==> we using the whole object cuz we want to acces on to different things movements and interestrate
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// Creat User Name
// ==> also using big function outside to pass the values and input from it instead putting function with Global variables
// ==> this function dosen't return any thing so we used forEach cuz we want to mutate the original accounts
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    // adding a new property (userName) for each obj in acconts array and that it is the mutation that happend to every obj in acconts.
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// ==> for good practice we make this function cuz we will use it more than one time,(refactoring).
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcPrintBalance(acc);

  // Display summery
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  // ==> cuz when we but the function inside the setInterval function the whole function inside start run after 1 sec, and we need to start count from five, not apper 00:01 then start 05:00, so we will declear the whole finction here (tick), then we will run it just one time befor setInterval and we will run it in setInterval.
  const tick = function () {
    // ==> make good looking clock timer
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 secondes, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    //Decrese 1s
    time--;
  };

  // set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  // ==> using return to save timer in (timer) variable in btnLogin and global timer, so when we loginto new account then will be value in timer and we can clearInterval and satrt new variable when login new account.
  return timer;
};

///////////////////////////////////////
// Event handlers

// ==> define currentAccount outside the function cuz we need this information outside.
let currentAccount;
/* ==> we need this variable to presest between different logins, so we will declear it in global, so when we need to check inside
 btnLogin if this variable exist or not to delete it, we will find it cuz it already decleard in the global.
 and also we need it global cuz we will clear interval and start it again when we use transfere or loan,
cuz the goal of this timer here is to track the inactivity of the user.*/
let timer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //==> if user input a username that isn't exist then will happen error cuz you acces on undefind value so we use optional chaninig to check if it is exist or not. and if it's not exist will print undefind without errors.
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // creat current date and time
    // ==> using internationalizing Dates better it's a new API gives good formatted dates
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Using templet letrals to change it to string, using padstart to start the nimbers with zero on the left.
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`;
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input filds
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    // ==> if there timer from last login it will not be exist and a new timer for new login will be created
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    // ==> if receiverAcc is undefind it will stop here
    receiverAcc &&
    currentAccount.balance >= amount &&
    // ==> if receiverAcc is undefind the condition uder will be true cuz !== so we need to be sure if receiverAcc is un defind it won't complete the check
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfare
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // ==> cuz when you request a loan from the bank, the bank take time to send you the money so we but settimeout to simulate this.
    setTimeout(function () {
      // Add movment
      currentAccount.movements.push(amount);

      // Add Loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    // find the index
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  // ==> we put the reset down this time cuz in the top we still dont read the data from inputs.
  inputCloseUsername.value = inputClosePin.value = '';
});

// declare the variabule outside cuz every time the value changed it will be preserved in sorted variable
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  // switching the value every time when we click on sorted btn
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
