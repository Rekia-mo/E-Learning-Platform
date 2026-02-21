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
User.hasMany(Teacher, { foreignKey: "userId" });
Teacher.belongsTo(User, { foreignKey: "userId" });

// User - Course (N → N)
User.belongsToMany(Course, { through: Enrollment, foreignKey: "userId" });
Course.belongsToMany(User, { through: Enrollment, foreignKey: "courseId" });

// User - Course (N → N)
User.belongsToMany(Course, { through: Saved_Course, foreignKey: "userId" });
Course.belongsToMany(User, { through: Saved_Course, foreignKey: "courseId" });

// Teacher - Course (1 → N)
Teacher.hasMany(Course, { foreignKey: "teacherId" });
Course.belongsTo(Teacher, { foreignKey: "teacherId" });

// Category - Course (1 → N)
Category.hasMany(Course, { foreignKey: "categoryId" });
Course.belongsTo(Category, { foreignKey: "categoryId" });

// User - Post (1 → N)
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

// Post - PostComment (1 → N)
Post.hasMany(PostComment, { foreignKey: "postId" });
PostComment.belongsTo(Post, { foreignKey: "postId" });

// User - PostComment (1 → N)
User.hasMany(PostComment, { foreignKey: "userId" });
PostComment.belongsTo(User, { foreignKey: "userId" });

// Course - CourseComment (1 → N)
Course.hasMany(CourseComment, { foreignKey: "courseId" });
CourseComment.belongsTo(Course, { foreignKey: "courseId" });

// User - CourseComment (1 → N)
User.hasMany(CourseComment, { foreignKey: "userId" });
CourseComment.belongsTo(User, { foreignKey: "userId" });

// Course - Lesson (1 → N)
Course.hasMany(Lesson, { foreignKey: "courseId" });
Lesson.belongsTo(Course, { foreignKey: "courseId" });

// User - Saved_Course (1 → N)
User.hasMany(Saved_Course, { foreignKey: "userId" });
Saved_Course.belongsTo(User, { foreignKey: "userId" });

// Course - SavedCourse (1 → N)
Course.hasMany(Saved_Course, { foreignKey: "courseId" });
Saved_Course.belongsTo(Course, { foreignKey: "courseId" });

// User - Enrollment (1 → N)
User.hasMany(Enrollment, { foreignKey: "userId" });
Enrollment.belongsTo(User, { foreignKey: "userId" });

// Course - Enrollment (1 → N)
Course.hasMany(Enrollment, { foreignKey: "courseId" });
Enrollment.belongsTo(Course, { foreignKey: "courseId" });

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
