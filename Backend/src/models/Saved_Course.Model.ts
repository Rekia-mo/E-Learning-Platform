
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// 1️⃣ Interface des attributs du model
interface SavedCourseAttributes {
  id: string;
  course_id: string;
  user_id: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface SavedCourseCreationAttributes extends Optional<SavedCourseAttributes, "id"> {}

// 3️⃣ Classe Model
class Saved_Course extends Model<SavedCourseAttributes, SavedCourseCreationAttributes>
  implements SavedCourseAttributes {

  public id!: string;
  public course_id!: string;
  public user_id!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Saved_Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Saved_Course",
    tableName: "Saved_Course",
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ["course_id", "user_id"]
      }
    ]
  }
);

export default Saved_Course;
