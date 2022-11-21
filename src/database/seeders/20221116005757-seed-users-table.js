'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [accounts] = await queryInterface.sequelize.query(
      'SELECT id FROM accounts'
    );

    await queryInterface.bulkInsert('users', [
      {
        username: 'Alan',
        password:
          '$2a$12$3I641JEi/UpCzY2vPtCT3.9gdoA75U9/YXg2DsS2s0WZvHpmXDtAW',
        created_at: new Date(),
        updated_at: new Date(),

        account_id: accounts[0].id
      },
      {
        username: 'Fulano',
        password:
          '$2a$12$3I641JEi/UpCzY2vPtCT3.9gdoA75U9/YXg2DsS2s0WZvHpmXDtAW',
        created_at: new Date(),
        updated_at: new Date(),

        account_id: accounts[1].id
      },
      {
        username: 'Beltrano',
        password:
          '$2a$12$3I641JEi/UpCzY2vPtCT3.9gdoA75U9/YXg2DsS2s0WZvHpmXDtAW',
        created_at: new Date(),
        updated_at: new Date(),

        account_id: accounts[2].id
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
