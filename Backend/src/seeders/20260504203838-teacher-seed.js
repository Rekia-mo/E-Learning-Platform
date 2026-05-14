"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the two teacher users by email
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM User WHERE email IN ('nadia.saoudi@email.com', 'khalil.amrani@email.com')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const nadiaId = users.find((u) => u.email === "nadia.saoudi@email.com").id;
    const khalilId = users.find((u) => u.email === "khalil.amrani@email.com").id;

    await queryInterface.bulkInsert("Teacher", [
      {
        id: uuidv4(),
        user_id: khalilId,
        isPsychologist: false,
        cv_URL: null,
        descreption: "Experienced CS professor with 10+ years teaching at university level. Specializing in algorithms, AI, and programming fundamentals. PhD from USTHB Algiers.",
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        user_id: nadiaId,
        isPsychologist: true,
        cv_URL: null,
        descreption: "Web development expert and certified psychologist. Teaching accessible web design and database management. Focuses on inclusive pedagogy for all learner types.",
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Teacher", null, {});
  },
};