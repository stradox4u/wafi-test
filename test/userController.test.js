const { expect } = require('chai');

const userController = require('../src/controllers/userController');
const users = require('../src/storage/storage');

describe('User Controller Tests', () => {
  it('Throws correct error if no user name is provided', () => {
    const result = userController.createUser.bind(this);
    expect(result).to.throw(Error, 'Name is required');
  });

  it('Creates user correctly', () => {
    userController.createUser('A');
    expect(users).to.haveOwnProperty('A');
  });
});