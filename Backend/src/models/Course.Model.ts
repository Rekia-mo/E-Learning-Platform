import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// 1️⃣ Interface des attributs du model
interface CourseAttributes {
  id: string;
  title: string;
  description: string;
  document?: string | null;
  image_url: string;
  isSpecialized: boolean;
  teacher_id: string;
  categorie_id: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface CourseCreationAttributes extends Optional<CourseAttributes, "id" | "document" | "isSpecialized"> {}

// 3️⃣ Classe Model
class Course extends Model<CourseAttributes, CourseCreationAttributes>
  implements CourseAttributes {

  public id!: string;
  public title!: string;
  public description!: string;
  public document?: string | null;
  public image_url!: string;
  public isSpecialized!: boolean;
  public teacher_id!: string;
  public categorie_id!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Course.init(
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
      allowNull: false
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isSpecialized: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    teacher_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    categorie_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Course",
    tableName: "Course",
    freezeTableName: true,
  }
);

export default Course;
