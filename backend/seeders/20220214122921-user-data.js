'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Ola',
          lastName: 'Nordmann',
          email: 'ola@nordmann.no',
          password: 'passord',
          createdAt: '2022-02-12 21:41:16.701+01',
          updatedAt: '2022-02-12 21:41:16.701+01'
        },
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
          password: 'password',
          createdAt: '2022-02-12 21:41:16.701+01',
          updatedAt: '2022-02-12 21:41:16.701+01'
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
