'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Trips',
      [
        {
          name: 'Ingrid og Andreas awesome tur',
          start: 'bergly',
          goal: 'brenna',
          date: new Date(),
          userId: 1,
          createdAt: '2022-02-12 21:41:16.701+01',
          updatedAt: '2022-02-12 21:41:16.701+01'
        },
        {
          name: 'Ingrid og Andreas awesome tur',
          start: 'bergly',
          goal: 'brenna',
          date: new Date(),
          userId: 1,
          createdAt: '2022-02-12 21:41:16.701+01',
          updatedAt: '2022-02-12 21:41:16.701+01'
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Trips', null, {});
  }
};
