"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM Role WHERE name IN ('Student', 'Teacher', 'Admin')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const studentRoleId = roles.find((r) => r.name === "Student").id;
    const teacherRoleId = roles.find((r) => r.name === "Teacher").id;
    const adminRoleId = roles.find((r) => r.name === "Admin").id;

    const studentPassword = await bcrypt.hash("Test@1234", 10);
    const teacherPassword = await bcrypt.hash("Teach@5678", 10);
    const adminPassword = await bcrypt.hash("admin1", 10);

    await queryInterface.bulkInsert("User", [
      //admin
        // Admin
      {
        id: uuidv4(),
        name: "admin",
        email: "admin1@email.com",
        password: adminPassword,
        role_id: adminRoleId,
        isSick: false,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Students
      {
        id: uuidv4(),
        name: "Amira Benali",
        email: "amira.benali@email.com",
        password: studentPassword,
        role_id: studentRoleId,
        isSick: false,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Yacine Oulhadj",
        email: "yacine.oulhadj@email.com",
        password: studentPassword,
        role_id: studentRoleId,
        isSick: true,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Melissa Rouabah",
        email: "melissa.rouabah@email.com",
        password: studentPassword,
        role_id: studentRoleId,
        isSick: false,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Omar Meziane",
        email: "omar.meziane@email.com",
        password: studentPassword,
        role_id: studentRoleId,
        isSick: false,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Teachers
      {
        id: uuidv4(),
        name: "Prof. Nadia Saoudi",
        email: "nadia.saoudi@email.com",
        password: teacherPassword,
        role_id: teacherRoleId,
        isSick: false,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Dr. Khalil Amrani",
        email: "khalil.amrani@email.com",
        password: teacherPassword,
        role_id: teacherRoleId,
        isSick: false,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("User", {
      email: [
        "amira.benali@email.com",
        "yacine.oulhadj@email.com",
        "melissa.rouabah@email.com",
        "omar.meziane@email.com",
        "nadia.saoudi@email.com",
        "khalil.amrani@email.com",
      ],
    }, {});
  },
};