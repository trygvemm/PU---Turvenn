'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'experience', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 3
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'experience');
  }
};
