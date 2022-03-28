'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'profilePic', {
      type: Sequelize.STRING
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'profilePic');
  }
};
