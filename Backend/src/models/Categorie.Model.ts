import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

// 1️⃣ Interface des attributs du model
interface CategorieAttributes {
  id: string;
  name: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface CategorieCreationAttributes extends Optional<CategorieAttributes, "id"> {}

// 3️⃣ Classe Model
class Categorie extends Model<CategorieAttributes, CategorieCreationAttributes>
  implements CategorieAttributes {

  public id!: string;
  public name!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Categorie.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Categorie"
  }
);

export default Categorie;
