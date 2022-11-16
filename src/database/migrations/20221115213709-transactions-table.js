'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      balance: {
        type: Sequelize.STRING,
        allowNull: false
      },
      debitedAccountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      creditedAccountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      value: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};
