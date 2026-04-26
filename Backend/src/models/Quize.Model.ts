import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

interface QuizeAttributes {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  course_id: string;
}

class Quize extends Model<QuizeAttributes> implements QuizeAttributes {
  public id!: string;
  public question!: string;
  public option_a!: string;
  public option_b!: string;
  public option_c!: string;
  public option_d!: string;
  public correct_answer!: string;
  public course_id!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Quize.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  course_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Course",
      key: "id"
    },
    onDelete: "CASCADE",
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  option_a: {
    type: DataTypes.STRING,
    allowNull: false
  },
  option_b: {
    type: DataTypes.STRING,
    allowNull: false
  },
  option_c: {
    type: DataTypes.STRING,
    allowNull: false
  },
  option_d: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correct_answer: {
    type: DataTypes.ENUM('a', 'b', 'c', 'd'),
    allowNull: false
  }
},
{
  sequelize,
  modelName: "Quize",
  tableName: "Quizes",
  freezeTableName: true,
})

export default Quize;