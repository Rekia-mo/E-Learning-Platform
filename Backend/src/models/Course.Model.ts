import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import { z } from "zod";

// 1️⃣ Interface des attributs du model
interface CourseAttributes {
  id: string;
  title: string;
  description: string;
  document?: string | null;
  image_url?: string | null;
  isSpecialized: boolean;
  likes: number;
  teacher_id: string;
  categorie_id: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface CourseCreationAttributes extends Optional<CourseAttributes, "id" | "document" | "isSpecialized"> { }

// 3️⃣ Classe Model
class Course extends Model<CourseAttributes, CourseCreationAttributes>
  implements CourseAttributes {

  public id!: string;
  public title!: string;
  public description!: string;
  public document?: string | null;
  public image_url?: string | null;
  public isSpecialized!: boolean;
  public likes!: number;
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
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: "Course",
    tableName: "Course",
    freezeTableName: true,
  }
);

export const CreateCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  isSpecialized: z.union([z.boolean(), z.string()])
    .transform((val) => val === true || val === "true"),
  categorie_id: z.string().uuid(),
});
export default Course;
