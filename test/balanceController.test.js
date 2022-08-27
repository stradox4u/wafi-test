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

describe('Balance Controller Test', () => {
  describe('User Deposit function tests', () => {
    it('Throws correct error if no username is provided', () => {
      const result = balanceController.userDeposit.bind(this, '', 15);
      expect(result).to.throw(Error, 'Username is required');
    });
    
    it('Throws correct error if no amount is provided', () => {
      const result = balanceController.userDeposit.bind(this, 'A', null);
      expect(result).to.throw(Error, 'Amount is required');
    });
  
    it('Correctly updates user balance', () => {
      createTestUserA();
      balanceController.userDeposit('A', 200);
      const relevantUser = users['A'];
      expect(relevantUser.balance).to.equal(200);
    });
  });

  describe('In App Transfer function tests', () => {
    it('Throws correct error if no origin user is provided', () => {
      const result = balanceController.inAppTransfer.bind(this, '', 'B', 100);
      expect(result).to.throw(Error, 'Origin user is required');
    });
  
    it('Throws correct error if no destination user is provided', () => {
      const result = balanceController.inAppTransfer.bind(this, 'A', '', 100);
      expect(result).to.throw(Error, 'Destination user is required');
    });
  
    it('Throws correct error if no amount is provided', () => {
      const result = balanceController.inAppTransfer.bind(this, 'A', 'B', null);
      expect(result).to.throw(Error, 'Amount is required');
    });
  
    it('Throws correct error if amount is greater than balance', () => {
      createTestUserA();
      createTestUserB();
      balanceController.userDeposit('A', 200);
      const result = balanceController.inAppTransfer.bind(this, 'A', 'B', 250);
  
      expect(result).to.throw(Error, 'Insufficient balance');
    });
  
    it('Correctly updates users balances', () => {
      createTestUserA();
      createTestUserB();
      balanceController.userDeposit('A', 200);
      balanceController.inAppTransfer('A', 'B', 150);
  
      expect(users['A'].balance).to.equal(50);
      expect(users['B'].balance).to.equal(150);
    });
  });

  describe('Get User Balance function tests', () => {
    it('Throws correct error if username is not provided', () => {
      const result = balanceController.getUserBalance.bind(this, '');
      expect(result).to.throw(Error, 'Username is required');
    });
  
    it('Returns correct user balance', () => {
      createTestUserA();
      balanceController.userDeposit('A', 200);
  
      const result = balanceController.getUserBalance('A');
  
      expect(result).to.equal(200);
    });
  });

  describe('Out App Transfer function tests', () => {
    it('Throws correct error if no origin user is provided', () => {
      const result = balanceController.outAppTransfer.bind(this, '', 100);
      expect(result).to.throw(Error, 'Username is required');
    });
  
    it('Throws correct error if no amount is provided', () => {
      const result = balanceController.outAppTransfer.bind(this, 'A', null);
      expect(result).to.throw(Error, 'Amount is required');
    });

    it('Throws correct error if amount is greater than balance', () => {
      createTestUserA();
      balanceController.userDeposit('A', 200);
      const result = balanceController.outAppTransfer.bind(this, 'A', 250);
  
      expect(result).to.throw(Error, 'Insufficient balance');
    });

    it('Correctly updates the user balance', () => {
      createTestUserA();
      balanceController.userDeposit('A', 200);

      balanceController.outAppTransfer('A', 100);

      expect(users['A'].balance).to.equal(100);
    })
  });
});