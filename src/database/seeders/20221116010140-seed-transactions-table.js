'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [accounts] = await queryInterface.sequelize.query(
      'SELECT id FROM accounts'
    );

    await queryInterface.bulkInsert('transactions', [
      {
        balance: '100',
        debitedAccountId: 1,
        creditedAccountId: 2,
        value: 20
      },
      {
        balance: '100',
        debitedAccountId: 2,
        creditedAccountId: 3,
        value: 20
      },
      {
        balance: '100',
        debitedAccountId: 3,
        creditedAccountId: 1,
        value: 20
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
  }
};
