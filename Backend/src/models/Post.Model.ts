import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

// 1️⃣ Interface des attributs du model
interface PostAttributes {
  id: string;
  user_id: string;
  title: string;
  content: string;
  likes: number;
  isSpecialized: boolean;
  
}

// 2️⃣ Interface des attributs optionnels à la création
interface PostCreationAttributes extends Optional<
  PostAttributes,
  "id" | "likes" | "isSpecialized"
> {}

// 3️⃣ Classe Model
class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: string;
  public user_id!: string;
  public title!: string;
  public content!: string;
  public likes!: number;
  public isSpecialized!: boolean;

  // timestamps Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️⃣ Init du model
Post.init(
  {
    // identifiant UUID primaire
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // id de l'utilisateur qui a créé le post
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // titre du post
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // contenu du post
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // nombre de likes (par défaut 0)
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // si le post est spécialisé (par défaut false)
    isSpecialized: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "Post",
    freezeTableName: true,
  },
);

export default Post;
