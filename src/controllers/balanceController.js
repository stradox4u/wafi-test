const users = require('../storage/storage');

exports.userDeposit = (userName, amount) => {
  if (!userName) {
    throw new Error('Username is required');
  }
  if (!amount) {
    throw new Error('Amount is required');
  }

  users[userName].balance += amount;
}

exports.inAppTransfer = (originUser, destinationUser, amount) => {
  if (!originUser) {
    throw new Error('Origin user is required');
  }
  if (!destinationUser) {
    throw new Error('Destination user is required');
  }
  if (!amount) {
    throw new Error('Amount is required');
  }
  if (users[originUser].balance < amount) {
    throw new Error('Insufficient balance');
  }

  users[originUser].balance -= amount;
  users[destinationUser].balance += amount;
}

exports.getUserBalance = (userName) => {
  if (!userName) {
    throw new Error('Username is required');
  }

  return users[userName].balance;
}

exports.outAppTransfer = (originUser, amount) => {
  if (!originUser) {
    throw new Error('Username is required');
  }
  if (!amount) {
    throw new Error('Amount is required');
  }
  if (users[originUser].balance < amount) {
    throw new Error('Insufficient balance');
  }

  users[originUser].balance -= amount;
}