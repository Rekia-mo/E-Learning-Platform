import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

// 1️⃣ Interface des attributs du model
interface PostAttributes {
  id: string;
  userId: string;
  title: string;
  content: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

// 3️⃣ Classe Model
class Post extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes {

  public id!: string;
  public userId!: string;
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
    userId: {
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
    modelName: "Post"
  }
);

export default Post;
