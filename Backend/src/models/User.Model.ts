import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
import z from "zod";

=======
import { Role } from "./index"; // importer le modèle Role pour  l'utiliser dans la méthode generateAuthToken
>>>>>>> 604b8b5354eeda1accdee6b1cf0de70262a470fb

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
interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "isSick"
> {}

// 3️⃣ Classe Model
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role_id!: string;
  public isSick!: boolean;
  public Role?: Role; // Association optionnelle pour accéder au rôle de l'utilisateur
  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public generateAuthToken(roleName: string): string {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }
    return jwt.sign(
      {
        id: this.id,
        role: roleName,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" },
    );
  }
}

// 4️⃣ Init du model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isSick: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "User",
    freezeTableName: true,
  },
);


//USER VALIDATION SCHEMA
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export default User;
