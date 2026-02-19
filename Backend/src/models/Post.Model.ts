import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// 1️⃣ Interface des attributs du model
interface PostAttributes {
  id: string;
  user_id: string;
  title: string;
  content: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

// 3️⃣ Classe Model
class Post extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes {

  public id!: string;
  public user_id!: string;
  public title!: string;
  public content!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Post.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "Post",
    freezeTableName: true,
  }
);

export default Post;
