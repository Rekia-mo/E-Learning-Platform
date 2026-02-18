import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db.js";

// 1️⃣ Interface des attributs du model
interface PostCommentAttributes {
  id: string;
  comment: string;
  user_id: string;
  post_id: string;
}

// 2️⃣ Interface des attributs optionnels à la création
interface PostCommentCreationAttributes extends Optional<PostCommentAttributes, "id"> {}

// 3️⃣ Classe Model
class Post_Comment extends Model<PostCommentAttributes, PostCommentCreationAttributes>
  implements PostCommentAttributes {

  public id!: string;
  public comment!: string;
  public user_id!: string;
  public post_id!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Post_Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Post_Comment"
  }
);

export default Post_Comment;
