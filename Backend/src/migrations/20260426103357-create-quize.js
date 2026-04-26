'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Quizes", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Course",
          key: "id"
        },
        onDelete: "CASCADE",
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      option_a: {
        type: Sequelize.STRING,
        allowNull: false
      },
      option_b: {
        type: Sequelize.STRING,
        allowNull: false
      },
      option_c: {
        type: Sequelize.STRING,
        allowNull: false
      },
      option_d: {
        type: Sequelize.STRING,
        allowNull: false
      },
      correct_answer: {
        type: Sequelize.ENUM('a', 'b', 'c', 'd'),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Quizes');
  }
};
