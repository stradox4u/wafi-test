const { expect } = require('chai');

const balanceController = require('../src/controllers/balanceController');
const userController = require('../src/controllers/userController');
const users = require('../src/storage/storage');

const createTestUserA = () => {
  userController.createUser('A')
}
const createTestUserB = () => {
  userController.createUser('B');
}

const clearUsers = () => {
  Object.keys(users).forEach(user => {
    delete users[user];
  });
}

describe('Balance Controller Test', () => {
  afterEach(() => {
    clearUsers();
  });
  describe('User Deposit function tests', () => {
    it('Throws correct error if no username is provided', () => {
      const result = balanceController.userDeposit.bind(this, '', {curr: 'USD', amount: 15});
      expect(result).to.throw(Error, 'Username is required');
    });
    
    it('Throws correct error if no amount is provided', () => {
      const result = balanceController.userDeposit.bind(this, 'A', {curr: 'USD', amount: null});
      expect(result).to.throw(Error, 'Amount is required');
    });
    
    it('Throws correct error if no currency is provided', () => {
      const result = balanceController.userDeposit.bind(this, 'A', {curr: null, amount: 100});
      expect(result).to.throw(Error, 'Currency is required');
    });
  
    it('Correctly updates user balance', () => {
      createTestUserA();
      balanceController.userDeposit('A', {curr: 'USD', amount: 200});
      const relevantUser = users['A'];
      expect(relevantUser.balance['USD']).to.equal(200);
    });
  });

  describe('In App Transfer function tests', () => {
    afterEach(() => {
      clearUsers();
    });
    it('Throws correct error if no origin user is provided', () => {
      const result = balanceController.inAppTransfer.bind(this, '', 'B', {curr: 'USD', amount: 100});
      expect(result).to.throw(Error, 'Origin user is required');
    });
  
    it('Throws correct error if no destination user is provided', () => {
      const result = balanceController.inAppTransfer.bind(this, 'A', '', {curr: 'USD', amount: 100});
      expect(result).to.throw(Error, 'Destination user is required');
    });
  
    it('Throws correct error if no amount is provided', () => {
      const result = balanceController.inAppTransfer.bind(this, 'A', 'B', {curr: 'USD', amount: null});
      expect(result).to.throw(Error, 'Amount is required');
    });
  
    it('Throws correct error if no currency is provided', () => {
      const result = balanceController.inAppTransfer.bind(this, 'A', 'B', {curr: null, amount: 100});
      expect(result).to.throw(Error, 'Currency is required');
    });
  
    it('Throws correct error if amount is greater than total assets', () => {
      createTestUserA();
      createTestUserB();
      balanceController.userDeposit('A', {curr: 'USD', amount: 200});
      const result = balanceController.inAppTransfer.bind(this, 'A', 'B', {curr: 'USD', amount: 250});
  
      expect(result).to.throw(Error, 'Insufficient balance');
    });
  
    it('Correctly updates users balances', () => {
      createTestUserA();
      createTestUserB();
      balanceController.userDeposit('A', {curr: 'USD', amount: 200});
      balanceController.inAppTransfer('A', 'B', {curr: 'USD', amount: 150});
  
      expect(users['A'].balance['USD']).to.equal(50);
      expect(users['B'].balance['USD']).to.equal(150);
    });

    it('Correctly debits users assets to make up transfer', () => {
      createTestUserA();
      createTestUserB();
      // Deposit 1 USD in all currencies
      balanceController.userDeposit('A', { curr: 'USD', amount: balanceController.conversions['USD'] });
      balanceController.userDeposit('A', { curr: 'NGN', amount: balanceController.conversions['NGN'] });
      balanceController.userDeposit('A', { curr: 'GBP', amount: balanceController.conversions['GBP'] });
      balanceController.userDeposit('A', { curr: 'YUAN', amount: balanceController.conversions['YUAN'] });

      balanceController.inAppTransfer('A', 'B', { curr: 'USD', amount: 4 });
      expect(users['A'].balance).to.haveOwnProperty('USD', 0);
      expect(users['A'].balance).to.haveOwnProperty('NGN', 0);
      expect(users['A'].balance).to.haveOwnProperty('GBP', 0);
      expect(users['A'].balance).to.haveOwnProperty('YUAN', 0);
      
      expect(users['B'].balance).to.haveOwnProperty('USD', 4);
      expect(users['B'].balance).to.haveOwnProperty('NGN', 0);
      expect(users['B'].balance).to.haveOwnProperty('GBP', 0);
      expect(users['B'].balance).to.haveOwnProperty('YUAN', 0);
    });
  });

  describe('Get User Balance function tests', () => {
    afterEach(() => {
      clearUsers();
    });
    it('Throws correct error if username is not provided', () => {
      const result = balanceController.getUserBalance.bind(this, '');
      expect(result).to.throw(Error, 'Username is required');
    });
  
    it('Returns correct user balance', () => {
      createTestUserA();
      balanceController.userDeposit('A', {curr: 'USD', amount: 200});
  
      const result = balanceController.getUserBalance('A');
  
      expect(result['USD']).to.equal(200);
    });
  });

  describe('Out App Transfer function tests', () => {
    afterEach(() => {
      clearUsers();
    });
    it('Throws correct error if no origin user is provided', () => {
      const result = balanceController.outAppTransfer.bind(this, '', {curr: 'USD', amount: 100});
      expect(result).to.throw(Error, 'Username is required');
    });
  
    it('Throws correct error if no amount is provided', () => {
      const result = balanceController.outAppTransfer.bind(this, 'A', {curr: 'USD', amount: null});
      expect(result).to.throw(Error, 'Amount is required');
    });
  
    it('Throws correct error if no currency is provided', () => {
      const result = balanceController.outAppTransfer.bind(this, 'A', {curr: null, amount: 200});
      expect(result).to.throw(Error, 'Currency is required');
    });

    it('Throws correct error if amount is greater than balance', () => {
      createTestUserA();
      balanceController.userDeposit('A', {curr: 'USD', amount: 200});
      const result = balanceController.outAppTransfer.bind(this, 'A', {curr: 'USD', amount: 250});
  
      expect(result).to.throw(Error, 'Insufficient balance');
    });

    it('Correctly updates the user balance', () => {
      createTestUserA();
      balanceController.userDeposit('A', {curr: 'USD', amount: 200});

      balanceController.outAppTransfer('A', {curr: 'USD', amount: 100});

      expect(users['A'].balance['USD']).to.equal(100);
    })
  });
});