import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// 1️⃣ Interface des attributs du modèle
interface RoleAttributes {
  id: string;
  name: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {}

// 3️⃣ Classe Model
class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: string;
  public name!: string;

  // timestamps Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du modèle
Role.init(
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
  },
  {
    sequelize, // le même que dans l'import
    modelName: "Role",
    tableName: "Role", // optionnel, si tu veux forcer le nom exact de la table
    timestamps: true, // active createdAt et updatedAt
  },
);

export default Role;
