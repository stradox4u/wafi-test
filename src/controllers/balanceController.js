const users = require('../storage/storage');
const conversionTable = {
  USD: 1,
  NGN: 415,
  GBP: 0.86,
  YUAN: 6.89,
}

const getRate = (dest, origin) => {
  return conversionTable[dest] / conversionTable[origin];
}

const convertCurrency = (amount, dest, origin) => {
  return amount * getRate(dest, origin);
}

// console.log(convertCurrency(830, 'USD', 'NGN'));
// console.log(convertCurrency(415, 'USD', 'NGN'));

// console.log(convertCurrency(450, 'NGN', 'USD'));
// console.log(convertCurrency(convertCurrency(450, 'NGN', 'USD'), 'USD', 'GBP'));
exports.conversions = conversionTable;

// Perhaps typechecking inputs would also be useful here.
exports.userDeposit = (userName, { curr, amount }) => {
  if (!userName) {
    throw new Error('Username is required');
  }
  if (!amount) {
    throw new Error('Amount is required');
  }
  if (!curr) {
    throw new Error('Currency is required');
  }

  users[userName].balance[curr] += amount;
}

// Controller method is perhaps too long, and some logic could be extracted into a service
exports.inAppTransfer = (originUser, destinationUser, { curr, amount }) => {
  if (!originUser) {
    throw new Error('Origin user is required');
  }
  if (!destinationUser) {
    throw new Error('Destination user is required');
  }
  if (!amount) {
    throw new Error('Amount is required');
  }
  if (!curr) {
    throw new Error('Currency is required');
  }

  // Convert all assets to usd
  let assetsInUsd = 0;
  Object.keys(users[originUser].balance).forEach(bal => {
    const balInUsd = convertCurrency(users[originUser].balance[bal], 'USD', bal);
    assetsInUsd += balInUsd;
  });

  // Convert transfer amount to USD
  const amountInUsd = amount / conversionTable[curr];
  if (assetsInUsd < amountInUsd) {
    throw new Error('Insufficient balance');
  }
  let transferAmount = amount;
  // Check if balance in USD is less than amount
  if (curr !== 'USD') {
    transferAmount = amount / conversionTable[curr];
  }
  if (users[originUser].balance[curr] > amount) {
    users[originUser].balance[curr] -= amount;
    users[destinationUser].balance[curr] += amount;
    return;
  }

  // Calculate overage
  let overage = amount - users[originUser].balance[curr];
  users[originUser].balance[curr] = 0;

  Object.keys(users[originUser].balance).forEach(bal => {
    if (overage > 0) {
      const nextBal = users[originUser].balance[bal];
      if (nextBal === 0) return;
      const convNextBal = convertCurrency(nextBal, curr, bal);

      if (overage < convNextBal) {
        const excessCurrency = convertCurrency(convNextBal - overage, bal, curr);
        overage = 0;
        users[originUser].balance[bal] = excessCurrency;
        return;
      }

      users[originUser].balance[bal] = 0;
      overage -= convNextBal;
    } else {
      return;
    }
  });

  users[destinationUser].balance[curr] += amount;
}

exports.getUserBalance = (userName) => {
  if (!userName) {
    throw new Error('Username is required');
  }

  return users[userName].balance;
}

// We could extract the same service for debiting other balances in turn, and reuse it here
exports.outAppTransfer = (originUser, {curr, amount}) => {
  if (!originUser) {
    throw new Error('Username is required');
  }
  if (!amount) {
    throw new Error('Amount is required');
  }
  if (!curr) {
    throw new Error('Currency is required');
  }
  if (users[originUser].balance[curr] < amount) {
    throw new Error('Insufficient balance');
  }

  users[originUser].balance[curr] -= amount;
}