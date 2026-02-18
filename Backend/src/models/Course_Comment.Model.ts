import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

// 1️⃣ Interface des attributs du model
interface CourseCommentAttributes {
  id: string;
  comment: string;
  user_id: string;
  course_id: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface CourseCommentCreationAttributes extends Optional<CourseCommentAttributes, "id"> {}

// 3️⃣ Classe Model
class Course_Comment extends Model<CourseCommentAttributes, CourseCommentCreationAttributes>
  implements CourseCommentAttributes {

  public id!: string;
  public comment!: string;
  public user_id!: string;
  public course_id!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Course_Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Course_Comment"
  }
);

export default Course_Comment;
