import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// 1️⃣ Interface des attributs du model
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role_id: string;
  isSick: boolean;
}

// 2️⃣ Interface des attributs optionnels à la création
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "isSick"> {}

// 3️⃣ Classe Model
class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {

  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role_id!: string;
  public isSick!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    isSick: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "User",
    freezeTableName: true,
  }
);

export default User;
