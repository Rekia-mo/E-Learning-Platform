import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// 1️⃣ Interface des attributs du model
interface TeacherAttributes {
  id: string;
  user_id: string;
  isPsychologist: boolean;
  cv_URL?: string | null;
  status: "pending" | "approved" | "rejected";
  descreption?: string | null;
}

// 2️⃣ Interface des attributs optionnels à la création
interface TeacherCreationAttributes extends Optional<TeacherAttributes, "id" | "isPsychologist" | "cv_URL" | "status" | "descreption"> { }

// 3️⃣ Classe Model
class Teacher extends Model<TeacherAttributes, TeacherCreationAttributes>
  implements TeacherAttributes {

  public id!: string;
  public user_id!: string;
  public isPsychologist!: boolean;
  public cv_URL?: string | null;
  public status!: "pending" | "approved" | "rejected";
  public descreption?: string | null;

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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isPsychologist: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cv_URL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descreption: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Teacher",
    tableName: "Teacher",
    freezeTableName: true,
  }
);

export default Teacher;
