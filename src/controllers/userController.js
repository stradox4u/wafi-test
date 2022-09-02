const storage = require('../storage/storage.js');

exports.createUser = (name) => {
  if (!name) {
    const error = new Error('Name is required');
    throw error;
  }
  if (typeof name !== 'string') {
    throw new Error('Name must be a string');
  }

  if (storage.hasOwnProperty(name)) {
    throw new Error('Name must be unique');
  }

  storage[name] = {
    name: name,
    balance: {
      USD: 0,
      NGN: 0,
      GBP: 0,
      YUAN: 0,
    },
  };
}