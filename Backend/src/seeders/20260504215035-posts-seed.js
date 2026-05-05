"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM User WHERE email IN (
        'melissa.rouabah@email.com',
        'yacine.oulhadj@email.com',
        'amira.benali@email.com',
        'omar.meziane@email.com'
      )`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const userId = (email) => users.find((u) => u.email === email).id;

    await queryInterface.bulkInsert("Post", [
      {
        id: uuidv4(),
        user_id: userId("melissa.rouabah@email.com"),
        title: "Question about SQL joins",
        content: "Hey everyone, I'm on lesson 3 of SQL & Database Design and I'm struggling with LEFT JOIN vs RIGHT JOIN. Can anyone explain when to use each? The examples in the lesson help but I want to be sure I get it.",
        likes: 8,
        isSpecialized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        user_id: userId("yacine.oulhadj@email.com"),
        title: "The Accessible Web Design course is amazing",
        content: "I wanted to share that the Accessible Web Design for All course by Prof. Nadia is exactly what I needed. The font size is bigger and the steps are very clear. It makes me feel included. Thank you Prof. Nadia!",
        likes: 34,
        isSpecialized: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        user_id: userId("amira.benali@email.com"),
        title: "First week on Diversity!",
        content: "Just completed my first week and already finished 2 lessons of Python. The AI quiz at the end really helps me check my understanding. So happy to be part of this community! 🎉",
        likes: 12,
        isSpecialized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        user_id: userId("omar.meziane@email.com"),
        title: "Tips for studying CS BASICS",
        content: "For anyone just starting out with the Introduction to Computer Science course — do NOT skip the flowchart lesson. I skipped it at first and struggled with the algorithms unit. Going back and doing it properly made everything click.",
        likes: 27,
        isSpecialized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Post", null, {});
  },
};