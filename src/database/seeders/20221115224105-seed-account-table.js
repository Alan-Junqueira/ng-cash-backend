'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('accounts', [
      {
        balance: 100,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        balance: 100,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        balance: 100,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('accounts', null, {});
  }
};
