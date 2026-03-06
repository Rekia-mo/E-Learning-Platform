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
Teacher.hasMany(Course, { foreignKey: "teacher_Id" });
Course.belongsTo(Teacher, { foreignKey: "teacher_Id" });

// Category - Course (1 → N)
Category.hasMany(Course, { foreignKey: "category_Id" });
Course.belongsTo(Category, { foreignKey: "category_Id" });

// User - Post (1 → N)
User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });

// Post - PostComment (1 → N)
Post.hasMany(PostComment, { foreignKey: "post_Id" });
PostComment.belongsTo(Post, { foreignKey: "post_Id" });

// User - PostComment (1 → N)
User.hasMany(PostComment, { foreignKey: "user_Id" });
PostComment.belongsTo(User, { foreignKey: "user_Id" });

// Course - CourseComment (1 → N)
Course.hasMany(CourseComment, { foreignKey: "course_Id" });
CourseComment.belongsTo(Course, { foreignKey: "course_Id" });

// User - CourseComment (1 → N)
User.hasMany(CourseComment, { foreignKey: "user_Id" });
CourseComment.belongsTo(User, { foreignKey: "user_Id" });

// Course - Lesson (1 → N)
Course.hasMany(Lesson, { foreignKey: "course_Id" });
Lesson.belongsTo(Course, { foreignKey: "course_Id" });

// User - Saved_Course (1 → N)
User.hasMany(Saved_Course, { foreignKey: "user_Id" });
Saved_Course.belongsTo(User, { foreignKey: "user_Id" });

// Course - SavedCourse (1 → N)
Course.hasMany(Saved_Course, { foreignKey: "course_Id" });
Saved_Course.belongsTo(Course, { foreignKey: "course_Id" });

// User - Enrollment (1 → N)
User.hasMany(Enrollment, { foreignKey: "user_Id" });
Enrollment.belongsTo(User, { foreignKey: "user_Id" });

// Course - Enrollment (1 → N)
Course.hasMany(Enrollment, { foreignKey: "course_Id" });
Enrollment.belongsTo(Course, { foreignKey: "course_Id" });

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
