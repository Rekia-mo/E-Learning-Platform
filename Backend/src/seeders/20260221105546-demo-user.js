"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 🔹 Hasher le mot de passe
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 🔹 Créer le user student
    await queryInterface.bulkInsert("User", [
      {
        id: "uuid-student-1", // UUID du user, tu peux changer si tu veux
        name: "Student User",
        email: "student@example.com",
        password: hashedPassword,
        role_id: "b3c756ce-09b2-4a6a-8aa4-4d318bd61fff", // ⚠️ METTRE ICI L'UUID EXACT DU ROLE student
        isSick: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Supprimer le user créé
    await queryInterface.bulkDelete(
      "User",
      { email: "student@example.com" },
      {},
    );
  },
};
