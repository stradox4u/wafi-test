const userController = require('./controllers/userController');
const balanceController = require('./controllers/balanceController');
const users = require('./storage/storage');

userController.createUser('A');
console.log('User A added', users);

balanceController.userDeposit('A', 10);
console.log('User A deposited 10 USD', users['A']);

userController.createUser('B');
console.log('User B created', users);

balanceController.userDeposit('B', 20);
console.log('User B deposited 20 USD', users['B']);

balanceController.inAppTransfer('B', 'A', 15);
console.log('User B transferred 15 USD to User A', users);

const userABalance = balanceController.getUserBalance('A');
console.log('User A checks balance', userABalance);

const userBBalance = balanceController.getUserBalance('B');
console.log('User B checks balance', userBBalance);

balanceController.outAppTransfer('A', 25);
console.log('User A transfers 25 USD out of app', users['A']);

const userAFinalBalance = balanceController.getUserBalance('A');
console.log('User A checks final balance', userAFinalBalance);