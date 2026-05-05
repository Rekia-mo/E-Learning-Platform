"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categorie", [
      { id: uuidv4(), name: "CS BASICS",   createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "WEB DEV",     createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "CS CORE",     createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "DATABASES",   createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "NETWORKING",  createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "PROGRAMMING", createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "DESIGN",      createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "MOBILE",      createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "AI",          createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "DEVOPS",      createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: "SECURITY",    createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categorie", null, {});
  },
};