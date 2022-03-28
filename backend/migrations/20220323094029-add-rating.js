'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Participations', 'rating', {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        max: 10
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Participations', 'rating');
  }
};
