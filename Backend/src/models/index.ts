import User from "./User.Model";
import Role from "./Role.Model";
import Teacher from "./Teacher.Model";
import Post from "./Post.Model";
import Course from "./Course.Model";
import Category from "./Categorie.Model";
import CourseComment from "./Course_Comment.Model";
import PostComment from "./Post_Comment.Model";
import Saved_Course from "./Saved_Course.Model";
import Enrollment from "./Enrollment.Model";
import Lesson from "./Lesson.Model";

// 🔗 Associations

// Role - User (1 → N)
Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

// User - Teacher (1 → N)
User.hasMany(Teacher, { foreignKey: "user_id" });
Teacher.belongsTo(User, { foreignKey: "user_id" });

// User - Course (N → N)
User.belongsToMany(Course, { through: Enrollment, foreignKey: "user_id" });
Course.belongsToMany(User, { through: Enrollment, foreignKey: "course_id" });

// User - Course (N → N)
User.belongsToMany(Course, { through: Saved_Course, foreignKey: "user_id" });
Course.belongsToMany(User, { through: Saved_Course, foreignKey: "course_id" });

// Teacher - Course (1 → N)
Teacher.hasMany(Course, { foreignKey: "teacher_id" });
Course.belongsTo(Teacher, { foreignKey: "teacher_id" });

// Category - Course (1 → N)
Category.hasMany(Course, { foreignKey: "category_id" });
Course.belongsTo(Category, { foreignKey: "category_id" });

// User - Post (1 → N)
User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });

// Post - PostComment (1 → N)
Post.hasMany(PostComment, { foreignKey: "post_id" });
PostComment.belongsTo(Post, { foreignKey: "post_id" });

// User - PostComment (1 → N)
User.hasMany(PostComment, { foreignKey: "user_id" });
PostComment.belongsTo(User, { foreignKey: "user_id" });

// Course - CourseComment (1 → N)
Course.hasMany(CourseComment, { foreignKey: "course_id" });
CourseComment.belongsTo(Course, { foreignKey: "course_id" });

// User - CourseComment (1 → N)
User.hasMany(CourseComment, { foreignKey: "user_id" });
CourseComment.belongsTo(User, { foreignKey: "user_id" });

// Course - Lesson (1 → N)
Course.hasMany(Lesson, { foreignKey: "course_id" });
Lesson.belongsTo(Course, { foreignKey: "course_id" });

// User - Saved_Course (1 → N)
User.hasMany(Saved_Course, { foreignKey: "user_id" });
Saved_Course.belongsTo(User, { foreignKey: "user_id" });

// Course - SavedCourse (1 → N)
Course.hasMany(Saved_Course, { foreignKey: "course_id" });
Saved_Course.belongsTo(Course, { foreignKey: "course_id" });

// User - Enrollment (1 → N)
User.hasMany(Enrollment, { foreignKey: "user_id" });
Enrollment.belongsTo(User, { foreignKey: "user_id" });

// Course - Enrollment (1 → N)
Course.hasMany(Enrollment, { foreignKey: "course_id" });
Enrollment.belongsTo(Course, { foreignKey: "course_id" });

export {
  User,
  Role,
  Teacher,
  Course,
  Category,
  Post,
  CourseComment,
  PostComment,
  Saved_Course,
  Enrollment,
  Lesson,
};
