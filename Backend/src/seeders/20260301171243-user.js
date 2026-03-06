"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);

    await queryInterface.bulkInsert("User", [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Alice",
        email: "alice@example.com",
        password: await bcrypt.hash("password123", salt), // 🔑 hash pour test
        isSick: false,
        role_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", // id de role fake
        emailVerified: false,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        name: "Bob",
        email: "bob@example.com",
        password: await bcrypt.hash("password123", salt),
        isSick: true,
        role_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        emailVerified: false,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        name: "Charlie",
        email: "charlie@example.com",
        password: await bcrypt.hash("password123", salt),
        isSick: false,
        role_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        emailVerified: false,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("User", null, {});
  },
};
