import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface PostLikeAttributes {
  id: string;
  post_id: string;
  user_id: string;
}

interface PostLikeCreationAttributes extends Optional<PostLikeAttributes, "id"> {}

class PostLike
  extends Model<PostLikeAttributes, PostLikeCreationAttributes>
  implements PostLikeAttributes
{
  public id!: string;
  public post_id!: string;
  public user_id!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PostLike.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PostLike",
    tableName: "PostLike",
    freezeTableName: true,
  }
);

export default PostLike;