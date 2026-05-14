"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Fetch teachers by email
    const teachers = await queryInterface.sequelize.query(
      `SELECT t.id, u.email FROM Teacher t
      INNER JOIN User u ON u.id = t.user_id
      WHERE u.email IN ('khalil.amrani@email.com', 'nadia.saoudi@email.com')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const khalilId = teachers.find((t) => t.email === "khalil.amrani@email.com").id;
    const nadiaId = teachers.find((t) => t.email === "nadia.saoudi@email.com").id;

    // 2️⃣ Fetch categories by name
    const categories = await queryInterface.sequelize.query(
      `SELECT id, name FROM Categorie WHERE name IN ('CS BASICS', 'PROGRAMMING', 'WEB DEV', 'DESIGN')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const catId = (name) => categories.find((c) => c.name === name).id;

    await queryInterface.bulkInsert("Course", [
      {
        id: uuidv4(),
        title: "Introduction to Computer Science",
        description: "A beginner-friendly course covering the core concepts of computer science including binary, logic gates, algorithms, and problem solving. Ideal for absolute beginners.",
        document: "https://en.wikipedia.org/api/rest_v1/page/pdf/Computer_science",
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
        isSpecialized: false,
        likes: 24,
        teacher_id: khalilId,
        categorie_id: catId("CS BASICS"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Python for Beginners",
        description: "Learn Python from scratch with hands-on exercises. Topics include variables, loops, functions, file handling, and basic OOP. No prior experience needed.",
        document: "https://en.wikipedia.org/api/rest_v1/page/pdf/Python_(programming_language)",
        image_url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80",
        isSpecialized: false,
        likes: 18,
        teacher_id: khalilId,
        categorie_id: catId("PROGRAMMING"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Web Development Fundamentals",
        description: "Master HTML, CSS, and JavaScript to build modern, responsive websites. Includes hands-on projects and accessibility best practices.",
        document: "https://en.wikipedia.org/api/rest_v1/page/pdf/Web_development",
        image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
        isSpecialized: false,
        likes: 42,
        teacher_id: nadiaId,
        categorie_id: catId("WEB DEV"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Accessible Web Design for All",
        description: "A specialized course on building web interfaces accessible to users with disabilities including Trisomy 21. Covers WCAG guidelines, large fonts, and simplified UX.",
        document: "https://en.wikipedia.org/api/rest_v1/page/pdf/Web_accessibility",
        image_url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80",
        isSpecialized: true,
        likes: 9,
        teacher_id: nadiaId,
        categorie_id: catId("DESIGN"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Course", null, {});
  },
};