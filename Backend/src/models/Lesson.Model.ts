import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// 1️⃣ Interface des attributs du model
interface LessonAttributes {
  id: string;
  title: string;
  description?: string | null;
  vedio_url: string;
  order_index: number;
  course_id: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface LessonCreationAttributes extends Optional<LessonAttributes, "id" | "description"> {}

// 3️⃣ Classe Model
class Lesson extends Model<LessonAttributes, LessonCreationAttributes>
  implements LessonAttributes {

  public id!: string;
  public title!: string;
  public description?: string | null;
  public vedio_url!: string;
  public order_index!: number;
  public course_id!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Lesson.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vedio_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Lesson",
    tableName: "Lesson",
    freezeTableName: true,
  }
);

export default Lesson;
