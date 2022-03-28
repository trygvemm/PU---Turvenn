'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM('user', 'admin', 'commercial'),
      allowNull: false,
      defaultValue: 'user'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'role');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
  }
};
