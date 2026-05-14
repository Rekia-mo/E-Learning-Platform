"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Fetch users
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

    // 2️⃣ Fetch posts by title
    const posts = await queryInterface.sequelize.query(
      `SELECT id, title FROM Post WHERE title IN (
        'Question about SQL joins',
        'The Accessible Web Design course is amazing',
        'First week on Diversity!',
        'Tips for studying CS BASICS'
      )`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const postId = (title) => posts.find((p) => p.title === title).id;

    await queryInterface.bulkInsert("Post_Comment", [
      // Comments on Melissa's post
      {
        id: uuidv4(),
        comment: "LEFT JOIN keeps all rows from the left table even if there's no match. RIGHT JOIN does the opposite. Most devs just use LEFT JOIN and swap the table order.",
        user_id: userId("omar.meziane@email.com"),
        post_id: postId("Question about SQL joins"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        comment: "This was confusing for me too, thanks Omar!",
        user_id: userId("amira.benali@email.com"),
        post_id: postId("Question about SQL joins"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Comment on Yacine's post
      {
        id: uuidv4(),
        comment: "So glad it's helpful for you Yacine! That course is beautifully designed.",
        user_id: userId("melissa.rouabah@email.com"),
        post_id: postId("The Accessible Web Design course is amazing"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Comments on Amira's post
      {
        id: uuidv4(),
        comment: "Welcome Amira! Python is a great start. Keep it up!",
        user_id: userId("omar.meziane@email.com"),
        post_id: postId("First week on Diversity!"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        comment: "Same here, the quizzes are so helpful!",
        user_id: userId("melissa.rouabah@email.com"),
        post_id: postId("First week on Diversity!"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Comment on Omar's post
      {
        id: uuidv4(),
        comment: "Thanks for the tip Omar, going back to it now!",
        user_id: userId("amira.benali@email.com"),
        post_id: postId("Tips for studying CS BASICS"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Post_Comment", null, {});
  },
};