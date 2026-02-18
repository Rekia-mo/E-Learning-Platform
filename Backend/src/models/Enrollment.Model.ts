import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

// 1️⃣ Interface des attributs du model
interface EnrollmentAttributes {
  id: string;
  course_id: string;
  user_id: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface EnrollmentCreationAttributes extends Optional<EnrollmentAttributes, "id"> {}

// 3️⃣ Classe Model
class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes>
  implements EnrollmentAttributes {

  public id!: string;
  public course_id!: string;
  public user_id!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Enrollment.init(
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
    modelName: "Enrollment",
    indexes: [
      {
        unique: true,
        fields: ["course_id", "user_id"]
      }
    ]
  }
);

export default Enrollment;
