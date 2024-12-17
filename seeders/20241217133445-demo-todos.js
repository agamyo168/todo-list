'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const today = new Date();
    const todos = [];

    for (let i = 0; i < 20; i++) {
      const randomTitle = `Todo ${i + 1}`;
      const randomDesc = `This is todo ${i + 1}.`;
      const randomCheck = Math.random() < 0.5; // 50% chance of being true or false
      const randomDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000); // Subtract i days from today

      todos.push({
        userId: 1,
        title: randomTitle,
        desc: randomDesc,
        check: randomCheck,
        createdAt: randomDate,
        updatedAt: randomDate,
      });
    }

    await queryInterface.bulkInsert('todos', todos, {});
  },

  async down(queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('todos', null, {});
  },
};
