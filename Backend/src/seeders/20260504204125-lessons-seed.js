"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Fetch courses by title
    const courses = await queryInterface.sequelize.query(
      `SELECT id, title FROM Course WHERE title IN (
        'Introduction to Computer Science',
        'Python for Beginners',
        'Web Development Fundamentals',
        'Accessible Web Design for All'
      )`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const courseId = (title) => courses.find((c) => c.title === title).id;

    await queryInterface.bulkInsert("Lesson", [
      // ─── Introduction to Computer Science ───
      {
        id: uuidv4(),
        title: "What is Computer Science?",
        description: "Overview of CS as a discipline, career paths, and how computers work at a high level.",
        vedio_url: "https://www.youtube.com/watch?v=SzJ46YA_RaA",
        order_index: 1,
        course_id: courseId("Introduction to Computer Science"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Binary & Number Systems",
        description: "Understanding binary, decimal, and hexadecimal. Converting between number bases with examples.",
        vedio_url: "https://www.youtube.com/watch?v=LpuPe81bc2w",
        order_index: 2,
        course_id: courseId("Introduction to Computer Science"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Logic Gates & Boolean Algebra",
        description: "AND, OR, NOT gates. Truth tables and how logic gates form the basis of CPUs.",
        vedio_url: "https://www.youtube.com/watch?v=gI-qXk7XojA",
        order_index: 3,
        course_id: courseId("Introduction to Computer Science"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Introduction to Algorithms",
        description: "What algorithms are, pseudocode, and tracing through simple sorting and search algorithms.",
        vedio_url: "https://www.youtube.com/watch?v=rL8X2mlNHPM",
        order_index: 4,
        course_id: courseId("Introduction to Computer Science"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Problem Solving & Flowcharts",
        description: "Breaking problems into steps, drawing flowcharts, and planning code before writing it.",
        vedio_url: "https://www.youtube.com/watch?v=6hfOvs8pY1k",
        order_index: 5,
        course_id: courseId("Introduction to Computer Science"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ─── Python for Beginners ───
      {
        id: uuidv4(),
        title: "Python Setup & First Program",
        description: "Installing Python, using the REPL, and writing your first Hello World program.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 1,
        course_id: courseId("Python for Beginners"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Variables & Data Types",
        description: "Strings, integers, floats, booleans. Type checking and casting between types.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 2,
        course_id: courseId("Python for Beginners"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Conditionals & Loops",
        description: "if/elif/else, while loops, and for loops. Writing programs that make decisions.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 3,
        course_id: courseId("Python for Beginners"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Functions & Scope",
        description: "Defining and calling functions, parameters, return values, and variable scope.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 4,
        course_id: courseId("Python for Beginners"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Lists & Dictionaries",
        description: "Working with collections of data, iterating, slicing, and common built-in methods.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 5,
        course_id: courseId("Python for Beginners"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "File Handling & Mini Project",
        description: "Reading and writing files in Python. Final mini project: a student grade tracker.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 6,
        course_id: courseId("Python for Beginners"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ─── Web Development Fundamentals ───
      {
        id: uuidv4(),
        title: "HTML Structure & Semantics",
        description: "The building blocks of web pages — tags, attributes, semantic HTML5 elements.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 1,
        course_id: courseId("Web Development Fundamentals"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "CSS Styling & Box Model",
        description: "Selectors, properties, the box model, and how styles cascade and inherit.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 2,
        course_id: courseId("Web Development Fundamentals"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Flexbox & Grid Layout",
        description: "Modern CSS layout techniques for building responsive, flexible page structures.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 3,
        course_id: courseId("Web Development Fundamentals"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "JavaScript Basics",
        description: "Variables, DOM manipulation, event listeners, and making web pages interactive.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 4,
        course_id: courseId("Web Development Fundamentals"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Responsive Design & Accessibility",
        description: "Media queries, mobile-first design, and WCAG accessibility best practices.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 5,
        course_id: courseId("Web Development Fundamentals"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ─── Accessible Web Design for All (Specialized) ───
      {
        id: uuidv4(),
        title: "Introduction to Accessible Design",
        description: "What web accessibility means and why it matters for users with cognitive and learning differences.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 1,
        course_id: courseId("Accessible Web Design for All"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Understanding Trisomy 21 & Digital Needs",
        description: "How users with Trisomy 21 interact with the web — attention span, reading level, and navigation needs.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 2,
        course_id: courseId("Accessible Web Design for All"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "WCAG Guidelines Simplified",
        description: "Breaking down WCAG 2.1 success criteria in plain language with real examples.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 3,
        course_id: courseId("Accessible Web Design for All"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Large Fonts, Colors & Contrast",
        description: "Choosing readable typography, high-contrast color schemes, and avoiding visual clutter.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 4,
        course_id: courseId("Accessible Web Design for All"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Simplified UX & Navigation",
        description: "Designing clear menus, big buttons, consistent layouts, and reduced cognitive load.",
        vedio_url: "https://www.youtube.com/watch?v=IDDmrzzB14M",
        order_index: 5,
        course_id: courseId("Accessible Web Design for All"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Lesson", null, {});
  },
};