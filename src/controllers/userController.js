const storage = require('../storage/storage.js');

exports.createUser = (name) => {
  if (!name) {
    const error = new Error('Name is required');
    throw error;
  }
  if (typeof name !== 'string') {
    throw new Error('Name must be a string');
  }

  storage[name] = {
    name: name,
    balance: 0,
  };
}