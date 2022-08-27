const storage = require('../storage/storage.js');

exports.createUser = (name) => {
  if (!name) {
    const error = new Error('Name is required');
    throw error;
  }

  storage[name] = {
    name: name,
    balance: 0,
  };
}