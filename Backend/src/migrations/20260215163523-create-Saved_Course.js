'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Saved_Course', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      course_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Course',
          key: 'id'
        }
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      uniqueKeys: {
        unique_saved_course: {
          fields: ['course_id', 'user_id']
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Saved_Course');
  }
};
