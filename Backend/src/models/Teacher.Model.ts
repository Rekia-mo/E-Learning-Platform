import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

// 1️⃣ Interface des attributs du model
interface TeacherAttributes {
  id: string;
  userId: string;
  isPsychologist: boolean;
  cvUrl?: string | null;
  status: "pending" | "approved" | "rejected";
}

// 2️⃣ Interface des attributs optionnels à la création
interface TeacherCreationAttributes extends Optional<TeacherAttributes, "id" | "isPsychologist" | "cvUrl" | "status"> {}

// 3️⃣ Classe Model
class Teacher extends Model<TeacherAttributes, TeacherCreationAttributes>
  implements TeacherAttributes {

  public id!: string;
  public userId!: string;
  public isPsychologist!: boolean;
  public cvUrl?: string | null;
  public status!: "pending" | "approved" | "rejected";

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Teacher.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isPsychologist: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cvUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Teacher"
  }
);

export default Teacher;
